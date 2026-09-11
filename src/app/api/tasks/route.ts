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
      // Sorted newest-first so the first row seen per task below is its
      // latest completion — tasks are repeatable, so a user can have many.
      totalumSdk.crud.query("user_task_completion", {
        _filter: { user: user._id },
        _sort: { completed_at: "desc" },
        _limit: 500,
      }),
    ]);

    const completions = (completionsResult.data as any[]) ?? [];
    // Most recent completion timestamp per task, used by the client to
    // compute the remaining cooldown (task.duration_minutes after that time).
    const lastCompletedAt: Record<string, string> = {};
    for (const c of completions) {
      const taskId = typeof c.earn_task === "object" ? c.earn_task?._id : c.earn_task;
      if (taskId && !lastCompletedAt[taskId]) {
        lastCompletedAt[taskId] = c.completed_at;
      }
    }

    return ok({
      tasks: tasksResult.data ?? [],
      lastCompletedAt,
    });
  } catch (err: any) {
    console.error("[api/tasks] failed:", err);
    return fail(err?.message || "Could not load tasks", 500);
  }
}
