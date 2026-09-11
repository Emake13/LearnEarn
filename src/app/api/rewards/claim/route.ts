import { totalumSdk } from "@/lib/totalum";
import {
  getCurrentUser,
  toMeProfile,
  applyWalletMovement,
  nextClaimAt,
  ok,
  fail,
} from "@/lib/learnearn-server";
import { DAILY_REWARD } from "@/lib/learnearn-config";

/**
 * Claims the daily reward shown on the dashboard banner.
 * Locked for 24 hours after each successful claim.
 */
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const locked = nextClaimAt(user);
    if (locked) {
      console.log("[api/rewards/claim] still locked until", locked);
      return Response.json(
        { ok: false, error: "Your next reward is not ready yet", nextClaimAt: locked },
        { status: 429 }
      );
    }

    const claimedAt = new Date().toISOString();

    await applyWalletMovement({
      userId: user._id,
      title: "Daily Reward Claimed",
      type: "reward",
      amount: DAILY_REWARD,
      currentBalance: user.balance ?? 0,
      currentAvailable: user.available_balance ?? 0,
    });

    await totalumSdk.crud.editRecordById("user", user._id, {
      reward_claimed: "yes",
      last_reward_claim_at: claimedAt,
    });

    const fresh = await getCurrentUser();
    if (!fresh) return fail("Could not reload your profile", 500);

    console.log("[api/rewards/claim] daily reward claimed by", user._id);
    return ok(await toMeProfile(fresh));
  } catch (err: any) {
    console.error("[api/rewards/claim] failed:", err);
    return fail(err?.message || "Could not claim your reward", 500);
  }
}
