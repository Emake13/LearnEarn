"use client";

import { useState } from "react";
import { ArrowDownToLine, Eye, EyeOff, Loader2, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { formatNaira } from "@/lib/learnearn-config";
import type { MeProfile } from "@/types/learnearn";
import { useAppState } from "./app-state";

const HIDDEN = "₦ • • • • • •";

/**
 * Primary wallet card — translucent glass over a neon-purple gradient mesh.
 * Balances come from the shared app state so they stay in sync app-wide.
 */
export function WalletCard() {
  const { profile, loading, balanceHidden, toggleBalance, setProfile } = useAppState();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const balance = profile?.balance ?? 0;
  const available = profile?.availableBalance ?? 0;

  const handleWithdraw = async () => {
    if (submitting) return;
    if (available <= 0) {
      setMessage({ kind: "err", text: "You have nothing available to withdraw yet." });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    console.log("[WalletCard] requesting withdrawal of", available);

    const res = await api.post<MeProfile>("/api/wallet/withdraw", { amount: available });

    if (res.ok && res.data) {
      setProfile(res.data);
      setMessage({ kind: "ok", text: "Withdrawal requested — we'll process it shortly." });
    } else {
      console.error("[WalletCard] withdrawal failed:", res.error);
      setMessage({ kind: "err", text: String(res.error || "Withdrawal failed. Try again.") });
    }
    setSubmitting(false);
  };

  return (
    <section className="le-rise relative mt-6" style={{ animationDelay: "140ms" }}>
      {/* Gradient mesh bloom behind the glass */}
      <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10">
        <div className="le-drift absolute top-2 left-2 h-44 w-44 rounded-full bg-[#7C3AED] opacity-45 blur-[60px]" />
        <div
          className="le-drift absolute -top-2 right-4 h-40 w-40 rounded-full bg-[#A855F7] opacity-30 blur-[70px]"
          style={{ animationDelay: "-9s" }}
        />
        <div
          className="le-drift absolute bottom-0 left-1/3 h-36 w-52 rounded-full bg-[#4F46E5] opacity-35 blur-[70px]"
          style={{ animationDelay: "-5s" }}
        />
      </div>

      <div className="le-glass le-grain relative overflow-hidden rounded-[28px] p-6 pt-5">
        {/* Floating wallet + naira coins */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-11 right-2 h-28 w-28 select-none"
        >
          <div className="le-float absolute top-6 right-2 grid h-[62px] w-[62px] place-items-center rounded-2xl border border-white/15 bg-white/[0.09] backdrop-blur-md">
            <Wallet className="h-7 w-7 text-white/85" strokeWidth={1.6} />
          </div>
          <div
            className="le-float absolute top-0 right-[52px] grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#FDE68A] to-[#F5B301] font-display text-[13px] font-extrabold text-[#7C4A03] shadow-[0_6px_18px_-6px_rgba(245,179,1,0.9)]"
            style={{ animationDelay: "-1.6s" }}
          >
            ₦
          </div>
          <div
            className="le-float absolute -top-3 right-0 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#FDE68A] to-[#F5B301] font-display text-[10px] font-extrabold text-[#7C4A03] shadow-[0_6px_16px_-6px_rgba(245,179,1,0.9)]"
            style={{ animationDelay: "-3.2s" }}
          >
            ₦
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-medium tracking-[0.02em] text-white/55">
              Total Balance
            </span>
            <button
              type="button"
              onClick={toggleBalance}
              aria-label={balanceHidden ? "Show balance" : "Hide balance"}
              aria-pressed={!balanceHidden}
              className="grid h-6 w-6 place-items-center rounded-full text-white/55 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-90"
            >
              {balanceHidden ? (
                <EyeOff className="h-[15px] w-[15px]" strokeWidth={2} />
              ) : (
                <Eye className="h-[15px] w-[15px]" strokeWidth={2} />
              )}
            </button>
          </div>

          <p className="le-tnum mt-1.5 font-display text-[36px] leading-none font-extrabold tracking-[-0.035em] text-white [text-shadow:0_2px_28px_rgba(167,139,250,0.35)]">
            {loading ? "₦—" : balanceHidden ? HIDDEN : formatNaira(balance)}
          </p>

          <p className="mt-2.5 text-[12px] font-medium text-white/45">
            Available Balance:{" "}
            <span className="le-tnum font-semibold text-white/75">
              {loading ? "₦—" : balanceHidden ? HIDDEN : formatNaira(available)}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleWithdraw}
          disabled={submitting || loading}
          className="group relative mt-6 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-4 shadow-[0_16px_40px_-14px_rgba(124,77,255,0.95)] transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(124,77,255,1)] hover:brightness-110 active:scale-[0.975] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            aria-hidden
            className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
          {submitting ? (
            <Loader2 className="relative h-[18px] w-[18px] animate-spin text-white" />
          ) : (
            <ArrowDownToLine
              className="relative h-[18px] w-[18px] text-white transition-transform duration-300 group-hover:translate-y-0.5"
              strokeWidth={2.4}
            />
          )}
          <span className="relative font-display text-[16px] font-bold tracking-[-0.01em] text-white">
            {submitting ? "Requesting…" : "Withdraw"}
          </span>
        </button>

        {message && (
          <p
            role="status"
            className={`relative mt-3 text-center text-[11.5px] font-medium ${
              message.kind === "ok" ? "text-[#4ADE80]" : "text-[#FCA5A5]"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
