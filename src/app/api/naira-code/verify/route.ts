import { totalumSdk } from "@/lib/totalum";
import {
  getCurrentUser,
  toMeProfile,
  applyWalletMovement,
  ok,
  fail,
} from "@/lib/learnearn-server";

/** Redeems a purchased Naira Code and credits its value to the wallet. */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const body = (await request.json()) as { code?: string };
    const code = (body?.code || "").trim().toUpperCase();
    if (!code) return fail("Enter the Naira Code you purchased");

    const result = await totalumSdk.crud.query("naira_code", {
      _filter: { code },
      _limit: 1,
    });
    const record = ((result.data as any[]) ?? [])[0];

    if (!record) return fail("That code was not recognised. Check it and try again.", 404);
    if (record.status === "used") return fail("This code has already been redeemed", 409);
    if (record.status === "expired") return fail("This code has expired", 410);

    const amount = Number(record.amount) || 0;

    await totalumSdk.crud.editRecordById("naira_code", record._id, {
      status: "used",
      used_by: user._id,
      used_at: new Date().toISOString(),
    });

    await applyWalletMovement({
      userId: user._id,
      title: `Naira Code ${code}`,
      type: "naira_code",
      amount,
      currentBalance: user.balance ?? 0,
      currentAvailable: user.available_balance ?? 0,
    });

    const fresh = await getCurrentUser();
    if (!fresh) return fail("Could not reload your profile", 500);

    console.log("[api/naira-code/verify] redeemed", { code, amount });
    return ok({ profile: await toMeProfile(fresh), amount });
  } catch (err: any) {
    console.error("[api/naira-code/verify] failed:", err);
    return fail(err?.message || "Could not verify that code", 500);
  }
}
