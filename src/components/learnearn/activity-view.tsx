"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  Banknote,
  Crown,
  KeyRound,
  Loader2,
  NotebookText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { formatNaira } from "@/lib/learnearn-config";
import type { WalletTransaction } from "@/types/learnearn";
import { PageHeader } from "./page-header";

const TYPE_ICON: Record<WalletTransaction["transaction_type"], LucideIcon> = {
  reward: Award,
  task_earning: ArrowDownLeft,
  naira_code: KeyRound,
  withdrawal: ArrowUpRight,
  upgrade: Crown,
};

/** Formats a timestamp as "Today • 14:22" style. */
function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const time = date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  if (sameDay(date, today)) return `Today • ${time}`;
  if (sameDay(date, yesterday)) return `Yesterday • ${time}`;
  return `${date.toLocaleDateString("en-NG", { day: "numeric", month: "short" })} • ${time}`;
}

/** Full wallet transaction log. */
export function ActivityView() {
  const [items, setItems] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await api.get<WalletTransaction[]>("/api/transactions");
      if (res.ok && res.data) {
        setItems(res.data);
      } else {
        console.error("[ActivityView] could not load transactions:", res.error);
        setError(String(res.error || "Could not load your activity."));
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="pb-4">
      <PageHeader title="Activity" subtitle="Every naira in and out, in one log." />

      {loading && (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#A78BFA]" />
        </div>
      )}

      {error && (
        <p role="alert" className="mt-6 text-[12.5px] font-medium text-[#FCA5A5]">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="le-panel mt-8 flex flex-col items-center gap-3 rounded-3xl px-6 py-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
            <NotebookText className="h-6 w-6 text-white/40" strokeWidth={1.8} />
          </span>
          <p className="font-display text-[15px] font-bold text-white">Nothing here yet</p>
          <p className="max-w-[15rem] text-[12px] leading-relaxed text-white/45">
            Complete a task or claim your reward and it will show up right here.
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2.5">
        {items.map((tx, i) => {
          const Icon = TYPE_ICON[tx.transaction_type] || Banknote;
          const isCredit = tx.amount >= 0;
          const isPending = tx.status === "pending";

          return (
            <div
              key={tx._id}
              className="le-rise le-panel flex items-center gap-3.5 rounded-2xl p-3.5"
              style={{ animationDelay: `${60 + i * 55}ms` }}
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
                  isCredit
                    ? "border-[#4ADE80]/25 bg-[#4ADE80]/10 text-[#4ADE80]"
                    : "border-[#F87171]/25 bg-[#F87171]/10 text-[#F87171]"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[13.5px] font-semibold text-white">
                  {tx.title}
                </p>
                <p className="truncate text-[11.5px] text-white/45">
                  {formatWhen(tx.createdAt)}
                  {isPending && <span className="ml-1.5 text-[#FBBF24]">• Pending</span>}
                </p>
              </div>

              <span
                className={`le-tnum shrink-0 font-display text-[13px] font-bold ${
                  isCredit ? "text-[#4ADE80]" : "text-white/70"
                }`}
              >
                {isCredit ? "+" : "−"}
                {formatNaira(Math.abs(tx.amount), false)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
