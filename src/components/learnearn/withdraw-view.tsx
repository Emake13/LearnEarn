"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Clock3,
  Copy,
  FileImage,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { formatNaira } from "@/lib/learnearn-config";
import { useAppState } from "./app-state";
import { PageHeader } from "./page-header";

const ACCOUNT_NUMBER = "6568437314";
const WHATSAPP_URL =
  "https://wa.me/13474349850?text=Hello%2C%20I%20have%20made%20payment%20for%20my%20Naira%20Code.";

type FlowStep = "intro" | "payment" | "processing" | "review";

function DetailRow({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("[v0] Could not copy account detail", error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.055] py-3 last:border-0">
      <span className="text-[11.5px] text-white/40">{label}</span>
      <span className="flex items-center gap-2 text-right font-display text-[13px] font-bold text-white">
        {value}
        {copyable && (
          <button
            type="button"
            onClick={copyValue}
            aria-label={`Copy ${label.toLowerCase()}`}
            className="grid size-8 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/60 transition hover:bg-white/[0.1] hover:text-white"
          >
            {copied ? <BadgeCheck className="size-4 text-[#4ADE80]" /> : <Copy className="size-4" />}
          </button>
        )}
      </span>
    </div>
  );
}

export function WithdrawView() {
  const { profile, loading } = useAppState();
  const [step, setStep] = useState<FlowStep>("intro");
  const [receipt, setReceipt] = useState<File | null>(null);
  const available = profile?.availableBalance ?? 0;

  const submitPayment = () => {
    if (step !== "payment") return;
    setStep("processing");
    window.setTimeout(() => setStep("review"), 10000);
  };

  if (step === "processing") {
    return (
      <div className="pb-4">
        <PageHeader title="Confirming payment" subtitle="Please keep this page open while we process your submission." />
        <div className="le-rise le-glass le-grain mt-5 rounded-[28px] p-8 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-3xl border border-[#F5B301]/30 bg-[#F5B301]/12 text-[#F5B301]">
            <Loader2 className="size-7 animate-spin" />
          </span>
          <h2 className="mt-5 font-display text-[20px] font-extrabold text-white">Processing payment</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-white/50">Your payment is being submitted for review. This may take a few seconds.</p>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full w-1/2 animate-pulse rounded-full bg-[#F5B301]" /></div>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="pb-4">
        <PageHeader title="Payment under review" subtitle="We will notify you when your Naira Code is ready." />
        <div className="le-rise le-glass le-grain mt-5 rounded-[28px] p-7 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-3xl border border-[#F5B301]/30 bg-[#F5B301]/12 text-[#F5B301]"><Clock3 className="size-7" /></span>
          <h2 className="mt-5 font-display text-[20px] font-extrabold text-white">Payment under review</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-white/50">Thanks for your payment. Our team is checking your receipt and will process your code shortly.</p>
          <Link href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-4 font-display text-[14px] font-bold text-[#062b16] transition hover:brightness-110 active:scale-[0.98]"><MessageCircle className="size-5" /> Contact support on WhatsApp</Link>
          <button type="button" onClick={() => { setStep("payment"); setReceipt(null); }} className="mt-3 w-full rounded-2xl border border-white/[0.1] bg-white/[0.04] py-3.5 font-display text-[13px] font-bold text-white/75 transition hover:bg-white/[0.09] hover:text-white">Try again</button>
        </div>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div className="pb-4">
        <PageHeader title="Withdraw" subtitle="Get your Naira Code with a quick manual payment." />
        <div className="le-rise le-glass le-grain relative mt-5 overflow-hidden rounded-[26px] p-5">
          <div className="relative flex items-center justify-between gap-4"><div><p className="text-[11px] font-semibold tracking-[0.06em] text-white/45 uppercase">Available balance</p><p className="le-tnum mt-1.5 font-display text-[27px] font-extrabold text-white">{loading ? "₦—" : formatNaira(available)}</p></div><span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/[0.07] text-white/80"><ArrowUpRight className="size-[22px]" /></span></div>
        </div>
        <div className="le-rise le-panel mt-5 rounded-[26px] p-6 text-center" style={{ animationDelay: "120ms" }}>
          <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]"><ShieldCheck className="size-6" /></span>
          <h2 className="mt-4 font-display text-[19px] font-extrabold text-white">Buy your Naira Code</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-white/50">Make a manual transfer of N7,100, then upload your receipt for verification.</p>
          <button type="button" onClick={() => setStep("payment")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-4 font-display text-[15.5px] font-bold text-white shadow-[0_16px_40px_-14px_rgba(124,77,255,0.95)] transition hover:brightness-110 active:scale-[0.975]">Buy Naira Code <ArrowUpRight className="size-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader title="Manual payment" subtitle="Transfer the exact amount using the details below." />
      <section className="le-rise le-panel mt-5 rounded-[26px] p-5" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between gap-3"><div><p className="text-[11px] font-semibold tracking-[0.06em] text-white/45 uppercase">Payment amount</p><p className="le-tnum mt-1 font-display text-[26px] font-extrabold text-white">N7,100</p></div><span className="rounded-full border border-[#F5B301]/25 bg-[#F5B301]/10 px-3 py-1.5 text-[11px] font-bold text-[#F5B301]">Exact amount</span></div>
        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4"><DetailRow label="Bank" value="Moniepoint" /><DetailRow label="Account Name" value="CHIKA ONYEABOR" /><DetailRow label="Account Number" value={ACCOUNT_NUMBER} copyable /></div>
      </section>
      <section className="le-rise mt-4 flex flex-col gap-3" style={{ animationDelay: "180ms" }}>
        <label htmlFor="payment-receipt" className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/[0.16] bg-white/[0.03] p-4 transition hover:border-[#8B5CF6]/60 hover:bg-white/[0.06]"><span className="grid size-10 place-items-center rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD]"><FileImage className="size-5" /></span><span className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-[13px] font-bold text-white">Upload Payment Receipt</span><span className="truncate text-[11px] text-white/40">{receipt ? receipt.name : "JPG, PNG or PDF"}</span></span><input id="payment-receipt" type="file" accept="image/*,.pdf" className="sr-only" onChange={(event) => setReceipt(event.target.files?.[0] ?? null)} /></label>
        <button type="button" onClick={submitPayment} className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-4 font-display text-[15.5px] font-bold text-white shadow-[0_16px_40px_-14px_rgba(124,77,255,0.95)] transition hover:brightness-110 active:scale-[0.975]">{receipt ? <Check className="size-5" /> : null} I Have Paid</button>
      </section>
      <div className="le-rise mt-4 flex items-start gap-3 rounded-2xl border border-[#8B5CF6]/22 bg-[#8B5CF6]/[0.07] p-4" style={{ animationDelay: "240ms" }}><AlertCircle className="mt-0.5 size-4 shrink-0 text-[#A78BFA]" /><p className="text-[11.5px] leading-relaxed text-white/55">Only transfer to the account details shown above. Need help? <Link href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-semibold text-[#C4B5FD] underline underline-offset-2">Contact support on WhatsApp</Link>.</p></div>
    </div>
  );
}
