"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, Loader2, ShoppingBag, Store, Ticket } from "lucide-react";
import { api } from "@/lib/api";
import { formatNaira } from "@/lib/learnearn-config";
import type { MeProfile } from "@/types/learnearn";
import { PageHeader } from "./page-header";
import { useAppState } from "./app-state";

const STEPS = [
  {
    icon: Store,
    title: "Buy from an agent",
    copy: "Get a Naira Code from any authorised LearnEarn vendor or agent near you.",
  },
  {
    icon: Ticket,
    title: "Scratch to reveal",
    copy: "Each card carries a unique code worth a fixed Naira value.",
  },
  {
    icon: ShoppingBag,
    title: "Redeem it here",
    copy: "Enter the code below and the value lands in your wallet instantly.",
  },
];

/** Explains Naira Codes and redeems one into the wallet. */
export function NairaCodeView() {
  const { setProfile } = useAppState();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<number | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter the code printed on your card.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(null);
    console.log("[NairaCodeView] verifying code");

    const res = await api.post<{ profile: MeProfile; amount: number }>(
      "/api/naira-code/verify",
      { code: trimmed }
    );

    if (res.ok && res.data) {
      setProfile(res.data.profile);
      setSuccess(res.data.amount);
      setCode("");
    } else {
      console.error("[NairaCodeView] verification failed:", res.error);
      setError(String(res.error || "That code could not be verified."));
    }
    setSubmitting(false);
  };

  return (
    <div className="pb-4">
      <PageHeader
        title="Buy Naira Code"
        subtitle="A Naira Code is a prepaid voucher that tops up your LearnEarn wallet — no card, no bank app needed."
      />

      <div className="mt-6 flex flex-col gap-2.5">
        {STEPS.map(({ icon: Icon, title, copy }, i) => (
          <div
            key={title}
            className="le-rise le-panel flex items-start gap-3.5 rounded-2xl p-3.5"
            style={{ animationDelay: `${80 + i * 70}ms` }}
          >
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#22D3EE]/25 bg-[#22D3EE]/12">
              <Icon className="h-[17px] w-[17px] text-[#67E8F9]" strokeWidth={2} />
              <span className="absolute -top-1.5 -left-1.5 grid h-5 w-5 place-items-center rounded-full bg-[#8B5CF6] font-display text-[10px] font-extrabold text-white">
                {i + 1}
              </span>
            </span>
            <div className="min-w-0">
              <p className="font-display text-[13.5px] font-bold text-white">{title}</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-white/45">{copy}</p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleVerify}
        className="le-rise le-glass le-grain relative mt-6 overflow-hidden rounded-[26px] p-5"
        style={{ animationDelay: "300ms" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-8 h-40 w-40 rounded-full bg-[#22D3EE] opacity-25 blur-[60px]"
        />

        <label
          htmlFor="naira-code"
          className="relative flex items-center gap-2 text-[12px] font-semibold text-white/70"
        >
          <KeyRound className="h-4 w-4 text-[#67E8F9]" strokeWidth={2.2} />
          Enter your Naira Code
        </label>

        <input
          id="naira-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (error) setError("");
          }}
          placeholder="LE-2026-XXXX-0000"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          className={`relative mt-3 w-full rounded-2xl border bg-[#0B0B0F]/60 px-4 py-3.5 text-center font-display text-[16px] font-bold tracking-[0.12em] text-white placeholder:font-body placeholder:text-[13px] placeholder:font-normal placeholder:tracking-normal placeholder:text-white/25 transition-all duration-300 outline-none ${
            error
              ? "border-[#F87171]/60 focus:border-[#F87171]"
              : "border-white/12 focus:border-[#22D3EE]/70 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
          }`}
        />

        {error && (
          <p role="alert" className="relative mt-2.5 text-[11.5px] font-medium text-[#FCA5A5]">
            {error}
          </p>
        )}

        {success !== null && (
          <div
            role="status"
            className="relative mt-3 flex items-center gap-2 rounded-xl border border-[#4ADE80]/25 bg-[#4ADE80]/10 px-3 py-2.5"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4ADE80]" strokeWidth={2.2} />
            <span className="text-[12px] font-semibold text-[#4ADE80]">
              {formatNaira(success)} added to your wallet
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#22D3EE] via-[#4F46E5] to-[#8B5CF6] py-3.5 shadow-[0_16px_40px_-14px_rgba(34,211,238,0.8)] transition-all duration-300 hover:brightness-110 active:scale-[0.975] disabled:opacity-60"
        >
          <span
            aria-hidden
            className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
          {submitting && <Loader2 className="relative h-[17px] w-[17px] animate-spin text-white" />}
          <span className="relative font-display text-[15px] font-bold text-white">
            {submitting ? "Verifying…" : "Verify Code"}
          </span>
        </button>
      </form>

      <Link
        href="/payment"
        className="le-rise group mt-4 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all duration-300 hover:border-[#8B5CF6]/40 hover:bg-white/[0.06]"
        style={{ animationDelay: "360ms" }}
      >
        <div className="min-w-0">
          <p className="font-display text-[13px] font-bold text-white">
            No agent nearby?
          </p>
          <p className="mt-0.5 text-[11.5px] text-white/45">
            Fund your account by direct bank transfer instead.
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
      </Link>
    </div>
  );
}
