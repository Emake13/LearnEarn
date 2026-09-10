import { totalumSdk } from "@/lib/totalum";
import { getCurrentUser, ok, fail } from "@/lib/learnearn-server";

/** Wallet transaction history for the signed-in user, newest first. */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const result = await totalumSdk.crud.query("wallet_transaction", {
      _filter: { user: user._id },
      _sort: { createdAt: "desc" },
      _limit: 50,
    });

    return ok(result.data ?? []);
  } catch (err: any) {
    console.error("[api/transactions] failed:", err);
    return fail(err?.message || "Could not load transactions", 500);
  }
}
