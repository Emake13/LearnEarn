import {
  getCurrentUser,
  toMeProfile,
  applyWalletMovement,
  ok,
  fail,
} from "@/lib/learnearn-server";
import { NIGERIAN_BANKS } from "@/lib/learnearn-config";
import type { MeProfile, WithdrawalReceipt } from "@/types/learnearn";

/** Builds a human-readable reference for a payout request. */
function buildReference(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const noise = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LE-WD-${stamp}${noise}`;
}

interface WithdrawBody {
  amount?: number;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
}

/**
 * Files a withdrawal request against the available balance.
 * The request is recorded as `pending` and settled by the payouts desk —
 * this endpoint never marks a payout as completed on its own.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const body = (await request.json()) as WithdrawBody;

    const amount = Number(body?.amount);
    const accountNumber = String(body?.accountNumber ?? "").trim();
    const accountName = String(body?.accountName ?? "").trim();
    const bankName = String(body?.bankName ?? "").trim();

    if (!amount || amount <= 0) return fail("Enter a valid amount to withdraw");
    if (amount > (user.available_balance ?? 0)) {
      return fail("That is more than your available balance");
    }
    if (!/^\d{10}$/.test(accountNumber)) {
      return fail("Enter the 10-digit account number");
    }
    if (accountName.length < 3) return fail("Enter the account name");
    if (!(NIGERIAN_BANKS as readonly string[]).includes(bankName)) {
      return fail("Select a bank from the list");
    }

    const reference = buildReference();
    const createdAt = new Date().toISOString();

    await applyWalletMovement({
      userId: user._id,
      title: "Withdrawal request",
      type: "withdrawal",
      amount: -amount,
      currentBalance: user.balance ?? 0,
      currentAvailable: user.available_balance ?? 0,
      status: "pending",
      extra: {
        reference,
        account_name: accountName,
        account_number: accountNumber,
        bank_name: bankName,
      },
    });

    const fresh = await getCurrentUser();
    if (!fresh) return fail("Could not reload your profile", 500);

    const receipt: WithdrawalReceipt = {
      reference,
      amount,
      accountName,
      accountNumber,
      bankName,
      status: "pending",
      createdAt,
    };

    console.log("[api/wallet/withdraw] requested", {
      userId: user._id,
      amount,
      bankName,
      reference,
    });

    return ok<{ profile: MeProfile; receipt: WithdrawalReceipt }>({
      profile: await toMeProfile(fresh),
      receipt,
    });
  } catch (err: any) {
    console.error("[api/wallet/withdraw] failed:", err);
    return fail(err?.message || "Could not submit your withdrawal", 500);
  }
}
