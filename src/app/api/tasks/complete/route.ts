import { totalumSdk } from "@/lib/totalum";
import {
  getCurrentUser,
  toMeProfile,
  applyWalletMovement,
  ok,
  fail,
} from "@/lib/learnearn-server";

/** Marks an earn task complete and credits its reward to the wallet. */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const body = (await request.json()) as { taskId?: string };
    const taskId = body?.taskId;
    if (!taskId) return fail("A taskId is required");

    const taskResult = await totalumSdk.crud.getRecordById("earn_task", taskId);
    const task = taskResult.data as any;
    if (!task?._id) return fail("That task no longer exists", 404);

    // Guard against double-crediting the same task.
    const existing = await totalumSdk.crud.query("user_task_completion", {
      _filter: { user: user._id, earn_task: taskId },
      _limit: 1,
    });
    if (((existing.data as any[]) ?? []).length > 0) {
      return fail("You have already completed this task", 409);
    }

    const reward = Number(task.reward_amount) || 0;

    await totalumSdk.crud.createRecord("user_task_completion", {
      user: user._id,
      earn_task: taskId,
      reward_amount: reward,
      completed_at: new Date().toISOString(),
    });

    await applyWalletMovement({
      userId: user._id,
      title: task.title || "Task reward",
      type: "task_earning",
      amount: reward,
      currentBalance: user.balance ?? 0,
      currentAvailable: user.available_balance ?? 0,
    });

    const fresh = await getCurrentUser();
    if (!fresh) return fail("Could not reload your profile", 500);

    console.log("[api/tasks/complete] task completed", { taskId, reward });
    return ok({ profile: await toMeProfile(fresh), reward });
  } catch (err: any) {
    console.error("[api/tasks/complete] failed:", err);
    return fail(err?.message || "Could not complete the task", 500);
  }
}
