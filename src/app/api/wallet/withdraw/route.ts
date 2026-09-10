import {
  getCurrentUser,
  toMeProfile,
  applyWalletMovement,
  ok,
  fail,
} from "@/lib/learnearn-server";

/** Files a withdrawal request against the available balance. */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const body = (await request.json()) as { amount?: number };
    const amount = Number(body?.amount);

    if (!amount || amount <= 0) return fail("Enter a valid amount to withdraw");
    if (amount > (user.available_balance ?? 0)) {
      return fail("That is more than your available balance");
    }

    await applyWalletMovement({
      userId: user._id,
      title: "Withdrawal request",
      type: "withdrawal",
      amount: -amount,
      currentBalance: user.balance ?? 0,
      currentAvailable: user.available_balance ?? 0,
      status: "pending",
    });

    const fresh = await getCurrentUser();
    if (!fresh) return fail("Could not reload your profile", 500);

    console.log("[api/wallet/withdraw] requested", { userId: user._id, amount });
    return ok(await toMeProfile(fresh));
  } catch (err: any) {
    console.error("[api/wallet/withdraw] failed:", err);
    return fail(err?.message || "Could not submit your withdrawal", 500);
  }
}
