"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, KeyRound, Receipt, TrendingUp } from "lucide-react";
import { BANK_DETAILS, formatNaira } from "@/lib/learnearn-config";
import { PageHeader } from "./page-header";
import { useAppState } from "./app-state";

const SHORTCUTS = [
  { href: "/buy-naira-code", label: "Redeem a Naira Code", icon: KeyRound, sub: "Top up with a voucher" },
  { href: "/payment", label: "Fund by bank transfer", icon: Receipt, sub: "Upload your receipt" },
  { href: "/upgrade", label: "Raise your limits", icon: TrendingUp, sub: "Go Pro for instant payouts" },
];

/** Wallet overview: balances, limits and funding shortcuts. */
export function WalletView() {
  const { profile, loading, balanceHidden, toggleBalance } = useAppState();

  const hidden = "₦ • • • • • •";
  const balance = profile?.balance ?? 0;
  const available = profile?.availableBalance ?? 0;

  return (
    <div className="pb-4">
      <PageHeader title="Wallet" subtitle="Balances, payout details and funding options." />

      <div className="le-rise le-glass le-grain relative mt-5 overflow-hidden rounded-[26px] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-14 -right-10 h-48 w-48 rounded-full bg-[#7C3AED] opacity-40 blur-[60px]"
        />

        <div className="relative flex items-center gap-2">
          <span className="text-[12px] font-medium text-white/55">Total balance</span>
          <button
            type="button"
            onClick={toggleBalance}
            aria-label={balanceHidden ? "Show balance" : "Hide balance"}
            className="grid h-6 w-6 place-items-center rounded-full text-white/55 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-90"
          >
            {balanceHidden ? (
              <EyeOff className="h-[15px] w-[15px]" strokeWidth={2} />
            ) : (
              <Eye className="h-[15px] w-[15px]" strokeWidth={2} />
            )}
          </button>
        </div>

        <p className="le-tnum relative mt-1.5 font-display text-[32px] leading-none font-extrabold tracking-[-0.035em] text-white">
          {loading ? "₦—" : balanceHidden ? hidden : formatNaira(balance)}
        </p>

        <div className="relative mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
            <p className="text-[10px] font-semibold tracking-[0.1em] text-white/40 uppercase">
              Available
            </p>
            <p className="le-tnum mt-1 font-display text-[15px] font-extrabold text-[#4ADE80]">
              {loading ? "₦—" : balanceHidden ? "₦ ••••" : formatNaira(available, false)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
            <p className="text-[10px] font-semibold tracking-[0.1em] text-white/40 uppercase">
              Tier
            </p>
            <p className="mt-1 font-display text-[15px] font-extrabold text-white">
              {profile?.tierName || "Beginner"}
            </p>
          </div>
        </div>
      </div>

      <section className="le-rise mt-5" style={{ animationDelay: "100ms" }}>
        <h2 className="mb-3 font-display text-[15px] font-bold text-white">Payout account</h2>
        <div className="le-panel rounded-2xl p-4">
          <p className="text-[11px] font-medium text-white/40">
            Withdrawals are reviewed manually and paid to your registered bank
            account. Fund your wallet using the official account below.
          </p>
          <div className="mt-3 flex flex-col gap-1.5 border-t border-white/[0.07] pt-3">
            {[
              ["Account Name", BANK_DETAILS.accountName],
              ["Account Number", BANK_DETAILS.accountNumber],
              ["Bank", BANK_DETAILS.bankName],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-[11.5px] text-white/45">{label}</span>
                <span className="truncate text-[12.5px] font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="le-rise mt-5" style={{ animationDelay: "160ms" }}>
        <h2 className="mb-3 font-display text-[15px] font-bold text-white">Add money</h2>
        <div className="flex flex-col gap-2.5">
          {SHORTCUTS.map(({ href, label, icon: Icon, sub }) => (
            <Link
              key={href}
              href={href}
              className="group le-panel flex items-center gap-3.5 rounded-2xl p-3.5 transition-all duration-300 hover:bg-white/[0.07]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#8B5CF6]/28 bg-[#8B5CF6]/12 text-[#C4B5FD]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[13.5px] font-semibold text-white">
                  {label}
                </p>
                <p className="truncate text-[11.5px] text-white/45">{sub}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
