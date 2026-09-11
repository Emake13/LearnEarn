import { totalumSdk } from "@/lib/totalum";
import { ok, fail } from "@/lib/learnearn-server";

/** Lists the active membership tiers, cheapest first. */
export async function GET() {
  try {
    const result = await totalumSdk.crud.query("upgrade_tier", {
      _filter: { status: "active" },
      _sort: { level: "asc" },
      _limit: 20,
    });
    return ok(result.data ?? []);
  } catch (err: any) {
    console.error("[api/tiers] failed:", err);
    return fail(err?.message || "Could not load tiers", 500);
  }
}
