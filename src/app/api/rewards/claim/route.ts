import { totalumSdk } from "@/lib/totalum";
import {
  getCurrentUser,
  toMeProfile,
  applyWalletMovement,
  ok,
  fail,
} from "@/lib/learnearn-server";
import { WELCOME_REWARD } from "@/lib/learnearn-config";

/** Claims the one-off welcome reward shown on the dashboard banner. */
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    if (user.reward_claimed === "yes") {
      return fail("You have already claimed this reward", 409);
    }

    await applyWalletMovement({
      userId: user._id,
      title: "Welcome reward claimed",
      type: "reward",
      amount: WELCOME_REWARD,
      currentBalance: user.balance ?? 0,
      currentAvailable: user.available_balance ?? 0,
    });

    await totalumSdk.crud.editRecordById("user", user._id, { reward_claimed: "yes" });

    const fresh = await getCurrentUser();
    if (!fresh) return fail("Could not reload your profile", 500);

    console.log("[api/rewards/claim] reward claimed by", user._id);
    return ok(await toMeProfile(fresh));
  } catch (err: any) {
    console.error("[api/rewards/claim] failed:", err);
    return fail(err?.message || "Could not claim your reward", 500);
  }
}
