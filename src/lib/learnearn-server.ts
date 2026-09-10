import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { totalumSdk } from "@/lib/totalum";
import { WELCOME_BALANCE } from "@/lib/learnearn-config";
import type { MeProfile } from "@/types/learnearn";

/** Raw shape of a row in the Totalum `user` table. */
export interface UserRecord {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  referral_code?: string;
  level?: number;
  balance?: number;
  available_balance?: number;
  reward_claimed?: "yes" | "no";
  current_tier?: string | { _id: string; name?: string };
}

/**
 * Resolves the signed-in user's Totalum record, initialising wallet defaults
 * the first time we see them. Returns null when there is no valid session.
 */
export async function getCurrentUser(): Promise<UserRecord | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    console.log("[learnearn-server] no active session");
    return null;
  }

  // NOTE: the auth session user exposes `id`, which is the Totalum `_id`.
  const result = await totalumSdk.crud.getRecordById("user", session.user.id);
  const record = result.data as unknown as UserRecord | undefined;

  if (!record?._id) {
    console.error("[learnearn-server] session user not found in DB:", session.user.id);
    return null;
  }

  return await ensureUserDefaults(record);
}

/**
 * Gives brand-new accounts their starting level, tier and welcome balance.
 * Idempotent — only runs when `level` has never been set.
 */
async function ensureUserDefaults(record: UserRecord): Promise<UserRecord> {
  if (record.level) return record;

  console.log("[learnearn-server] initialising new user wallet:", record._id);

  const tiersResult = await totalumSdk.crud.query("upgrade_tier", {
    _filter: { level: 1 },
    _limit: 1,
  });
  const beginnerTier = (tiersResult.data as any[])?.[0];

  const defaults: Record<string, unknown> = {
    level: 1,
    balance: WELCOME_BALANCE,
    available_balance: WELCOME_BALANCE,
    reward_claimed: "no",
  };
  if (beginnerTier?._id) defaults.current_tier = beginnerTier._id;

  await totalumSdk.crud.editRecordById("user", record._id, defaults);

  await totalumSdk.crud.createRecord("wallet_transaction", {
    user: record._id,
    title: "Welcome bonus",
    transaction_type: "reward",
    amount: WELCOME_BALANCE,
    status: "completed",
  });

  return { ...record, ...(defaults as Partial<UserRecord>) };
}

/** Maps a raw user row into the client-facing profile shape. */
export async function toMeProfile(record: UserRecord): Promise<MeProfile> {
  let tierName = record.level && record.level >= 2 ? "Pro" : "Beginner";

  const tier = record.current_tier;
  if (tier && typeof tier === "object" && tier.name) tierName = tier.name;

  return {
    id: record._id,
    name: record.name || "there",
    email: record.email || "",
    phone: record.phone,
    referralCode: record.referral_code,
    level: record.level ?? 1,
    balance: record.balance ?? 0,
    availableBalance: record.available_balance ?? 0,
    rewardClaimed: record.reward_claimed === "yes",
    tierName,
  };
}

/**
 * Applies a wallet movement and writes the matching transaction row.
 * `amount` is positive for credits and negative for debits.
 */
export async function applyWalletMovement(params: {
  userId: string;
  title: string;
  type: "reward" | "task_earning" | "naira_code" | "withdrawal" | "upgrade";
  amount: number;
  currentBalance: number;
  currentAvailable: number;
  status?: "completed" | "pending";
  /** When true the balance is left untouched and only the row is written. */
  recordOnly?: boolean;
}): Promise<{ balance: number; availableBalance: number }> {
  const {
    userId,
    title,
    type,
    amount,
    currentBalance,
    currentAvailable,
    status = "completed",
    recordOnly = false,
  } = params;

  const nextBalance = recordOnly ? currentBalance : currentBalance + amount;
  const nextAvailable = recordOnly ? currentAvailable : currentAvailable + amount;

  if (!recordOnly) {
    await totalumSdk.crud.editRecordById("user", userId, {
      balance: nextBalance,
      available_balance: nextAvailable,
    });
  }

  await totalumSdk.crud.createRecord("wallet_transaction", {
    user: userId,
    title,
    transaction_type: type,
    amount,
    status,
  });

  console.log("[learnearn-server] wallet movement", {
    userId,
    type,
    amount,
    nextBalance,
  });

  return { balance: nextBalance, availableBalance: nextAvailable };
}

/** Standard JSON success envelope. */
export function ok<T>(data: T, extra?: Record<string, unknown>) {
  return Response.json({ ok: true, data, ...(extra || {}) });
}

/** Standard JSON error envelope. */
export function fail(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}
