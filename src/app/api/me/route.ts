import { getCurrentUser, toMeProfile, ok, fail } from "@/lib/learnearn-server";

/** Returns the signed-in user's profile and wallet balances. */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);
    return ok(await toMeProfile(user));
  } catch (err: any) {
    console.error("[api/me] failed:", err);
    return fail(err?.message || "Could not load your profile", 500);
  }
}
