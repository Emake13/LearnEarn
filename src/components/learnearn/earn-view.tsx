"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Clock,
  Loader2,
  Megaphone,
  MessageSquareText,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { formatNairaShort } from "@/lib/learnearn-config";
import type { EarnTask, MeProfile } from "@/types/learnearn";
import { PageHeader } from "./page-header";
import { useAppState } from "./app-state";

const TYPE_META: Record<EarnTask["task_type"], { icon: LucideIcon; label: string; tint: string }> = {
  quiz: { icon: Sparkles, label: "Quiz", tint: "#8B5CF6" },
  lesson: { icon: PlayCircle, label: "Lesson", tint: "#4F46E5" },
  survey: { icon: MessageSquareText, label: "Survey", tint: "#22D3EE" },
  sponsored: { icon: Megaphone, label: "Sponsored", tint: "#F5B301" },
};

/** Micro-task board. Completing a task credits its reward immediately. */
export function EarnView() {
  const { setProfile } = useAppState();
  const [tasks, setTasks] = useState<EarnTask[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await api.get<{ tasks: EarnTask[]; completedTaskIds: string[] }>("/api/tasks");
      if (res.ok && res.data) {
        setTasks(res.data.tasks);
        setCompleted(res.data.completedTaskIds);
      } else {
        console.error("[EarnView] could not load tasks:", res.error);
        setError(String(res.error || "Could not load tasks."));
      }
      setLoading(false);
    })();
  }, []);

  const handleComplete = async (task: EarnTask) => {
    if (busyId) return;
    setBusyId(task._id);
    setError("");
    setToast("");
    console.log("[EarnView] completing task", task._id);

    const res = await api.post<{ profile: MeProfile; reward: number }>(
      "/api/tasks/complete",
      { taskId: task._id }
    );

    if (res.ok && res.data) {
      setProfile(res.data.profile);
      setCompleted((prev) => [...prev, task._id]);
      setToast(`${formatNairaShort(res.data.reward)} added to your wallet`);
    } else {
      console.error("[EarnView] completion failed:", res.error);
      setError(String(res.error || "Could not complete that task."));
    }
    setBusyId(null);
  };

  const totalAvailable = tasks
    .filter((t) => !completed.includes(t._id))
    .reduce((sum, t) => sum + (t.reward_amount || 0), 0);

  return (
    <div className="pb-4">
      <PageHeader
        title="Earn More"
        subtitle="Finish a task, get paid straight into your LearnEarn wallet."
      />

      {!loading && tasks.length > 0 && (
        <div
          className="le-rise le-glass mt-5 flex items-center justify-between rounded-2xl px-4 py-3.5"
          style={{ animationDelay: "60ms" }}
        >
          <span className="text-[12px] font-medium text-white/55">Still up for grabs</span>
          <span className="le-tnum font-display text-[17px] font-extrabold text-[#4ADE80]">
            {formatNairaShort(totalAvailable)}
          </span>
        </div>
      )}

      {loading && (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#A78BFA]" />
        </div>
      )}

      {error && (
        <p role="alert" className="mt-5 text-[12.5px] font-medium text-[#FCA5A5]">
          {error}
        </p>
      )}
      {toast && (
        <p role="status" className="mt-5 text-[12.5px] font-semibold text-[#4ADE80]">
          {toast}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {tasks.map((task, i) => {
          const meta = TYPE_META[task.task_type] || TYPE_META.quiz;
          const Icon = meta.icon;
          const isDone = completed.includes(task._id);
          const isBusy = busyId === task._id;

          return (
            <article
              key={task._id}
              className="le-rise le-panel le-grain relative overflow-hidden rounded-[22px] p-4"
              style={{ animationDelay: `${100 + i * 70}ms` }}
            >
              <div className="flex items-start gap-3.5">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${meta.tint}, ${meta.tint}55)` }}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-[14px] leading-snug font-bold tracking-[-0.01em] text-white">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-1 text-[11.5px] leading-snug text-white/45">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase"
                      style={{ backgroundColor: `${meta.tint}22`, color: meta.tint }}
                    >
                      {meta.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/40">
                      <Clock className="h-3 w-3" strokeWidth={2.2} />
                      {task.duration_minutes} min
                    </span>
                  </div>
                </div>

                <span className="le-tnum shrink-0 rounded-full border border-[#F5B301]/30 bg-[#F5B301]/12 px-2.5 py-1 text-[11px] font-bold text-[#FCD34D]">
                  {formatNairaShort(task.reward_amount)}
                </span>
              </div>

              {isDone ? (
                <div className="mt-3.5 flex items-center justify-center gap-1.5 rounded-xl border border-[#4ADE80]/25 bg-[#4ADE80]/10 py-2.5">
                  <BadgeCheck className="h-4 w-4 text-[#4ADE80]" strokeWidth={2.2} />
                  <span className="text-[12px] font-bold text-[#4ADE80]">Completed</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleComplete(task)}
                  disabled={isBusy}
                  className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] py-2.5 transition-all duration-300 hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/18 active:scale-[0.98] disabled:opacity-60"
                >
                  {isBusy && <Loader2 className="h-4 w-4 animate-spin text-white/80" />}
                  <span className="text-[12.5px] font-bold text-white/85">
                    {isBusy ? "Crediting…" : `Start & earn ${formatNairaShort(task.reward_amount)}`}
                  </span>
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
