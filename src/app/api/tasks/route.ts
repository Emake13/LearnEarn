import { totalumSdk } from "@/lib/totalum";
import { getCurrentUser, ok, fail } from "@/lib/learnearn-server";

/** Active earn tasks plus the ids this user has already completed. */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const [tasksResult, completionsResult] = await Promise.all([
      totalumSdk.crud.query("earn_task", {
        _filter: { status: "active" },
        _sort: { sort_order: "asc" },
        _limit: 50,
      }),
      totalumSdk.crud.query("user_task_completion", {
        _filter: { user: user._id },
        _limit: 300,
      }),
    ]);

    const completions = (completionsResult.data as any[]) ?? [];
    const completedTaskIds = completions.map((c) =>
      typeof c.earn_task === "object" ? c.earn_task?._id : c.earn_task
    );

    return ok({
      tasks: tasksResult.data ?? [],
      completedTaskIds: completedTaskIds.filter(Boolean),
    });
  } catch (err: any) {
    console.error("[api/tasks] failed:", err);
    return fail(err?.message || "Could not load tasks", 500);
  }
}
