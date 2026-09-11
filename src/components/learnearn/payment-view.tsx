"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ImageUp,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { BANK_DETAILS, PAYMENT_INSTRUCTION, formatNairaShort } from "@/lib/learnearn-config";
import { CopyField } from "./copy-field";
import { PageHeader } from "./page-header";
import { useAppState } from "./app-state";

/** Bank-transfer funding + receipt upload for verification. */
export function PaymentView() {
  const searchParams = useSearchParams();
  const { profile } = useAppState();

  const purpose = searchParams.get("purpose") === "upgrade" ? "upgrade" : "fund_account";
  const targetTier = searchParams.get("tier") || "";
  const presetAmount = searchParams.get("amount") || "";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [amount, setAmount] = useState(presetAmount);
  const [senderName, setSenderName] = useState(profile?.name || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const handleFile = (selected: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!selected) {
      setFile(null);
      setPreviewUrl("");
      return;
    }

    setFile(selected);
    setPreviewUrl(selected.type.startsWith("image/") ? URL.createObjectURL(selected) : "");
    setError("");
    console.log("[PaymentView] receipt selected", selected.name, selected.size);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!file) {
      setError("Attach a photo of your payment receipt first.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter the amount you transferred.");
      return;
    }
    if (!senderName.trim()) {
      setError("Enter the account name you transferred from.");
      return;
    }

    setSubmitting(true);
    setError("");
    console.log("[PaymentView] submitting receipt", { purpose, amount });

    const form = new FormData();
    form.append("receipt", file);
    form.append("amount", String(amount));
    form.append("purpose", purpose);
    form.append("senderName", senderName.trim());
    if (targetTier) form.append("targetTier", targetTier);

    const res = await api.upload<{ reference: string }>("/api/payment-requests", form);

    if (res.ok && res.data) {
      setReference(res.data.reference);
      handleFile(null);
      setAmount("");
    } else {
      console.error("[PaymentView] submission failed:", res.error);
      setError(String(res.error || "Could not submit your receipt. Try again."));
    }
    setSubmitting(false);
  };

  // Success state replaces the form entirely.
  if (reference) {
    return (
      <div className="pb-4">
        <PageHeader title="Receipt received" subtitle="We're reviewing your transfer." />

        <div className="le-rise le-glass le-grain relative mt-6 overflow-hidden rounded-[26px] p-6 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-14 left-1/3 h-44 w-44 rounded-full bg-[#4ADE80] opacity-25 blur-[60px]"
          />
          <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#4ADE80] to-[#16A34A] shadow-[0_14px_36px_-12px_rgba(74,222,128,0.9)]">
            <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={2.2} />
          </span>

          <h2 className="relative mt-5 font-display text-[19px] font-bold text-white">
            Submitted for verification
          </h2>
          <p className="relative mt-2 text-[12.5px] leading-relaxed text-white/50">
            Our team is checking your transfer now. Your wallet updates as soon
            as it clears — usually within a few minutes.
          </p>

          <div className="relative mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-white/40 uppercase">
              Your reference
            </p>
            <p className="le-tnum mt-1 font-display text-[16px] font-extrabold tracking-[0.08em] text-[#C4B5FD]">
              {reference}
            </p>
          </div>

          <Link
            href="/"
            className="relative mt-5 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] py-3.5 font-display text-[15px] font-bold text-white transition-all duration-300 hover:brightness-110 active:scale-[0.975]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader
        title={purpose === "upgrade" ? "Complete your upgrade" : "Fund your account"}
        subtitle="Make a direct bank transfer, then upload your receipt for verification."
        backHref={purpose === "upgrade" ? "/upgrade" : "/"}
      />

      {/* Instruction box — copy is fixed and must read exactly as specified. */}
      <div
        className="le-rise relative mt-5 overflow-hidden rounded-[24px] border border-[#F5B301]/30 bg-[#F5B301]/[0.09] p-4"
        style={{ animationDelay: "60ms" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-8 h-36 w-36 rounded-full bg-[#F5B301] opacity-20 blur-[50px]"
        />
        <div className="relative flex gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#F5B301]/25">
            <AlertTriangle className="h-4 w-4 text-[#FCD34D]" strokeWidth={2.4} />
          </span>
          <p className="text-[12.5px] leading-relaxed font-medium text-[#FDE9BC]">
            {PAYMENT_INSTRUCTION}
          </p>
        </div>
      </div>

      {/* Fixed account details */}
      <section className="le-rise mt-5" style={{ animationDelay: "120ms" }}>
        <h2 className="mb-3 flex items-center gap-2 font-display text-[15px] font-bold text-white">
          <ShieldCheck className="h-4 w-4 text-[#A78BFA]" strokeWidth={2.2} />
          Official account details
        </h2>

        <div className="flex flex-col gap-2.5">
          <CopyField label="Account Name" value={BANK_DETAILS.accountName} />
          <CopyField label="Account Number" value={BANK_DETAILS.accountNumber} mono />
          <CopyField label="Bank Name" value={BANK_DETAILS.bankName} />
        </div>

        <p className="mt-2.5 text-center text-[11px] text-white/35">
          Tap any field to copy it.
        </p>
      </section>

      {/* Receipt upload */}
      <form
        onSubmit={handleSubmit}
        className="le-rise le-panel le-grain relative mt-6 overflow-hidden rounded-[26px] p-5"
        style={{ animationDelay: "180ms" }}
      >
        <h2 className="font-display text-[15px] font-bold text-white">Upload your receipt</h2>
        <p className="mt-1 text-[11.5px] text-white/45">
          Snap a photo or pick the screenshot from your gallery.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          capture="environment"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {file ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04]">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Your payment receipt"
                className="max-h-56 w-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center gap-2 py-8 text-white/60">
                <ImageUp className="h-5 w-5" />
                <span className="text-[12.5px] font-medium">{file.name}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-3.5 py-2.5">
              <span className="min-w-0 truncate text-[11.5px] font-medium text-white/55">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => handleFile(null)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-[#FCA5A5] transition-colors duration-300 hover:bg-[#F87171]/12"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group mt-4 flex w-full flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] py-8 transition-all duration-300 hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/[0.07] active:scale-[0.99]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#6D28D9] shadow-[0_12px_28px_-12px_rgba(139,92,246,1)] transition-transform duration-300 group-hover:scale-105">
              <Camera className="h-[22px] w-[22px] text-white" strokeWidth={2} />
            </span>
            <span className="font-display text-[13.5px] font-bold text-white">
              Snap or upload receipt
            </span>
            <span className="text-[11px] text-white/40">PNG, JPG or PDF — up to 50MB</span>
          </button>
        )}

        <div className="mt-4 grid gap-3">
          <div>
            <label
              htmlFor="pay-amount"
              className="mb-1.5 block text-[11.5px] font-semibold text-white/65"
            >
              Amount transferred
              {presetAmount && (
                <span className="ml-1.5 text-[#A78BFA]">
                  (upgrade costs {formatNairaShort(Number(presetAmount))})
                </span>
              )}
            </label>
            <input
              id="pay-amount"
              type="number"
              inputMode="decimal"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 7500"
              className="w-full rounded-2xl border border-white/12 bg-[#0B0B0F]/60 px-4 py-3 text-[14px] font-semibold text-white placeholder:font-normal placeholder:text-white/25 transition-all duration-300 outline-none focus:border-[#8B5CF6]/70 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.12)]"
            />
          </div>

          <div>
            <label
              htmlFor="pay-sender"
              className="mb-1.5 block text-[11.5px] font-semibold text-white/65"
            >
              Account name you paid from
            </label>
            <input
              id="pay-sender"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Jame Adeyemi"
              className="w-full rounded-2xl border border-white/12 bg-[#0B0B0F]/60 px-4 py-3 text-[14px] font-semibold text-white placeholder:font-normal placeholder:text-white/25 transition-all duration-300 outline-none focus:border-[#8B5CF6]/70 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.12)]"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-[12px] font-medium text-[#FCA5A5]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#0EA5E9] py-4 shadow-[0_16px_40px_-14px_rgba(59,130,246,0.95)] transition-all duration-300 hover:brightness-110 active:scale-[0.975] disabled:opacity-60"
        >
          <span
            aria-hidden
            className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
          {submitting ? (
            <Loader2 className="relative h-[18px] w-[18px] animate-spin text-white" />
          ) : (
            <Upload className="relative h-[17px] w-[17px] text-white" strokeWidth={2.3} />
          )}
          <span className="relative font-display text-[15px] font-bold text-white">
            {submitting ? "Submitting…" : "Submit Receipt for Verification"}
          </span>
        </button>
      </form>
    </div>
  );
}
