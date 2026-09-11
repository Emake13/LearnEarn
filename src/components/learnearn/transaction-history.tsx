"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Award,
  ChevronRight,
  Clock3,
  Crown,
  KeyRound,
  Loader2,
  NotebookText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { formatDateTime, formatNaira } from "@/lib/learnearn-config";
import type { WalletTransaction } from "@/types/learnearn";
import { useAppState } from "./app-state";

const TYPE_ICON: Record<WalletTransaction["transaction_type"], LucideIcon> = {
  reward: Award,
  task_earning: NotebookText,
  naira_code: KeyRound,
  withdrawal: ArrowUpRight,
  upgrade: Crown,
};

/**
 * Compact wallet ledger on the dashboard: date, time, action and amount.
 * Re-reads itself whenever a wallet movement is signalled through app state.
 */
export function TransactionHistory({ limit = 5 }: { limit?: number }) {
  const { transactionsVersion, balanceHidden } = useAppState();
  const [rows, setRows] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await api.get<WalletTransaction[]>("/api/transactions");
    if (res.ok && Array.isArray(res.data)) {
      setRows(res.data);
    } else {
      console.error("[TransactionHistory] could not load transactions:", res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load, transactionsVersion]);

  const visible = rows.slice(0, limit);

  return (
    <section className="le-rise mt-7" style={{ animationDelay: "420ms" }}>
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-display text-[15px] font-bold tracking-[-0.01em] text-white">
          Transaction History
        </h2>
        <Link
          href="/activity"
          className="group inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-white/45 transition-colors duration-300 hover:text-[#C4B5FD]"
        >
          See all
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="le-panel le-grain relative overflow-hidden rounded-[22px]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-9 text-white/35">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-[12px]">Loading your history…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="px-5 py-9 text-center">
            <p className="font-display text-[13.5px] font-semibold text-white/70">
              No movements yet
            </p>
            <p className="mt-1 text-[11.5px] text-white/40">
              Claim your daily reward to get things going.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.055]">
            {visible.map((tx, i) => {
              const Icon = TYPE_ICON[tx.transaction_type] ?? Award;
              const credit = tx.amount >= 0;
              const { date, time } = formatDateTime(tx.createdAt);
              const pending = tx.status === "pending";

              return (
                <li
                  key={tx._id}
                  className="le-rise flex items-center gap-3 px-4 py-3.5"
                  style={{ animationDelay: `${460 + i * 55}ms` }}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
                      credit
                        ? "border-[#4ADE80]/22 bg-[#4ADE80]/10 text-[#4ADE80]"
                        : "border-[#F87171]/22 bg-[#F87171]/10 text-[#F87171]"
                    }`}
                  >
                    <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-[13px] font-semibold text-white">
                      {tx.title}
                    </p>
                    <p className="le-tnum mt-0.5 flex items-center gap-1.5 text-[11px] text-white/40">
                      <span>{date}</span>
                      <span aria-hidden className="text-white/20">
                        •
                      </span>
                      <span>{time}</span>
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`le-tnum font-display text-[13px] font-bold ${
                        credit ? "text-[#4ADE80]" : "text-[#F87171]"
                      }`}
                    >
                      {balanceHidden
                        ? "₦ • • • •"
                        : `${credit ? "+" : "-"}${formatNaira(Math.abs(tx.amount))}`}
                    </p>
                    {pending && (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#F5B301]">
                        <Clock3 className="h-3 w-3" strokeWidth={2.3} />
                        Pending
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
