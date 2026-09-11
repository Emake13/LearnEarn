"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  Clock3,
  Copy,
  Loader2,
  MailCheck,
  Send,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  NIGERIAN_BANKS,
  formatDateTime,
  formatNaira,
} from "@/lib/learnearn-config";
import type { MeProfile, WithdrawalReceipt } from "@/types/learnearn";
import { useAppState } from "./app-state";
import { PageHeader } from "./page-header";

interface FieldErrors {
  amount?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  verificationCode?: string;
}

/** Floating-label glass input used by every field on this form. */
function FloatingField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  maxLength,
  prefix,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal";
  maxLength?: number;
  prefix?: string;
  hint?: string;
}) {
  const filled = value.length > 0;

  return (
    <div>
      <div
        className={`group relative rounded-2xl border bg-white/[0.03] transition-all duration-300 focus-within:bg-white/[0.055] ${
          error
            ? "border-[#F87171]/55 focus-within:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]"
            : "border-white/[0.09] focus-within:border-[#8B5CF6]/70 focus-within:shadow-[0_0_0_4px_rgba(139,92,246,0.14)]"
        }`}
      >
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 z-10 origin-left font-medium transition-all duration-200 ${
            filled
              ? "top-2 text-[10px] tracking-[0.05em] text-white/40 uppercase"
              : "top-1/2 -translate-y-1/2 text-[13px] text-white/35"
          } group-focus-within:top-2 group-focus-within:translate-y-0 group-focus-within:text-[10px] group-focus-within:tracking-[0.05em] group-focus-within:text-[#C4B5FD] group-focus-within:uppercase`}
        >
          {label}
        </label>

        <div className="flex items-end">
          {prefix && filled && (
            <span className="le-tnum pb-3 pl-4 font-display text-[15px] font-semibold text-white/55">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type={type}
            inputMode={inputMode}
            maxLength={maxLength}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`le-tnum w-full bg-transparent pt-6 pb-2.5 ${
              prefix && filled ? "pl-1" : "pl-4"
            } pr-4 font-display text-[15px] font-semibold text-white outline-none placeholder:text-white/25`}
          />
        </div>
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 pl-1 text-[11px] font-medium text-[#FCA5A5]"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 pl-1 text-[11px] text-white/35">{hint}</p>
      )}
    </div>
  );
}

/** A single labelled line on the request receipt. */
function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-[11.5px] text-white/40">{label}</span>
      <span className="le-tnum max-w-[62%] text-right font-display text-[12.5px] font-semibold break-words text-white">
        {value}
      </span>
    </div>
  );
}

/**
 * Withdrawal request form. A submitted request is queued for the payouts
 * desk — this screen never claims a payout has already been sent.
 */
export function WithdrawView() {
  const { profile, loading, setProfile, bumpTransactions } = useAppState();

  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSentTo, setCodeSentTo] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<WithdrawalReceipt | null>(null);
  const [copied, setCopied] = useState(false);

  const available = profile?.availableBalance ?? 0;

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const value = Number(amount);

    if (!amount.trim() || !Number.isFinite(value) || value <= 0) {
      next.amount = "Enter the amount you want to withdraw.";
    } else if (value > available) {
      next.amount = `That is more than your available balance of ${formatNaira(available)}.`;
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      next.accountNumber = "Account numbers are exactly 10 digits.";
    }
    if (accountName.trim().length < 3) {
      next.accountName = "Enter the name on the account.";
    }
    if (!bankName) {
      next.bankName = "Choose the receiving bank.";
    }
    if (!verificationCode.trim()) {
      next.verificationCode = "Enter the code we emailed you.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (submitting || !validate()) return;

    setSubmitting(true);
    console.log("[WithdrawView] submitting withdrawal request", { amount, bankName });

    const res = await api.post<{ profile: MeProfile; receipt: WithdrawalReceipt }>(
      "/api/wallet/withdraw",
      {
        amount: Number(amount),
        accountNumber,
        accountName: accountName.trim(),
        bankName,
        verificationCode: verificationCode.trim(),
      }
    );

    if (res.ok && res.data) {
      setProfile(res.data.profile);
      bumpTransactions();
      setReceipt(res.data.receipt);
    } else {
      console.error("[WithdrawView] withdrawal failed:", res.error);
      setFormError(String(res.error || "Could not submit your withdrawal."));
    }
    setSubmitting(false);
  };

  const handleSendCode = async () => {
    if (sendingCode) return;
    setSendingCode(true);
    setFormError("");
    console.log("[WithdrawView] requesting a withdrawal verification code");

    const res = await api.post<{ sentTo: string; expiresInMinutes: number }>(
      "/api/wallet/verification-code",
      {}
    );

    if (res.ok && res.data) {
      setCodeSentTo(res.data.sentTo);
      setErrors((e) => ({ ...e, verificationCode: undefined }));
    } else {
      console.error("[WithdrawView] could not send code:", res.error);
      setFormError(String(res.error || "Could not send your verification code."));
    }
    setSendingCode(false);
  };

  const copyReference = async () => {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt.reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("[WithdrawView] clipboard write failed:", err);
    }
  };

  if (receipt) {
    const { date, time } = formatDateTime(receipt.createdAt);

    return (
      <div className="pb-4">
        <PageHeader
          title="Withdrawal requested"
          subtitle="Your request is queued for the payouts desk."
        />

        <div className="le-rise le-glass le-grain relative mt-5 overflow-hidden rounded-[28px] p-6 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[#8B5CF6] opacity-30 blur-[60px]"
          />

          <span className="le-breathe relative mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-[#F5B301]/30 bg-[#F5B301]/12 text-[#F5B301]">
            <Clock3 className="h-7 w-7" strokeWidth={2} />
          </span>

          <h2 className="relative mt-5 font-display text-[20px] leading-tight font-extrabold tracking-[-0.025em] text-white">
            Submitted for review
          </h2>
          <p className="relative mt-2 text-[12px] leading-relaxed text-white/50">
            We have put {formatNaira(receipt.amount)} on hold and sent the request to
            our payouts desk. You will see it marked as paid here once the transfer
            leaves our account.
          </p>

          <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#F5B301]/28 bg-[#F5B301]/10 px-3 py-1.5 text-[11px] font-bold text-[#F5B301]">
            <Clock3 className="h-3.5 w-3.5" strokeWidth={2.4} />
            Pending review
          </span>
        </div>

        <section
          className="le-rise le-panel mt-4 rounded-[24px] px-5 py-3"
          style={{ animationDelay: "120ms" }}
        >
          <div className="divide-y divide-white/[0.055]">
            <ReceiptRow label="Reference" value={receipt.reference} />
            <ReceiptRow label="Amount" value={formatNaira(receipt.amount)} />
            <ReceiptRow label="Account name" value={receipt.accountName} />
            <ReceiptRow label="Account number" value={receipt.accountNumber} />
            <ReceiptRow label="Bank" value={receipt.bankName} />
            <ReceiptRow label="Requested" value={`${date} • ${time}`} />
            <ReceiptRow label="Status" value="Pending review" />
          </div>
        </section>

        <button
          type="button"
          onClick={copyReference}
          className="le-rise mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.09] bg-white/[0.03] py-3 text-[12.5px] font-semibold text-white/70 transition-all duration-300 hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
          style={{ animationDelay: "180ms" }}
        >
          {copied ? (
            <BadgeCheck className="h-4 w-4 text-[#4ADE80]" strokeWidth={2.2} />
          ) : (
            <Copy className="h-4 w-4" strokeWidth={2.1} />
          )}
          {copied ? "Reference copied" : "Copy reference"}
        </button>

        <div className="le-rise mt-4 flex gap-3" style={{ animationDelay: "240ms" }}>
          <Link
            href="/activity"
            className="flex-1 rounded-2xl border border-white/[0.09] bg-white/[0.03] py-3.5 text-center font-display text-[13.5px] font-bold text-white/75 transition-all duration-300 hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
          >
            View activity
          </Link>
          <Link
            href="/"
            className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-3.5 text-center shadow-[0_16px_40px_-14px_rgba(124,77,255,0.95)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            <span
              aria-hidden
              className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <span className="relative font-display text-[13.5px] font-bold text-white">
              Done
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader
        title="Withdraw"
        subtitle="Tell us where to send it and we will queue the transfer."
      />

      <div className="le-rise le-glass le-grain relative mt-5 overflow-hidden rounded-[26px] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-14 -right-10 h-44 w-44 rounded-full bg-[#7C3AED] opacity-35 blur-[60px]"
        />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.06em] text-white/45 uppercase">
              Available to withdraw
            </p>
            <p className="le-tnum mt-1.5 font-display text-[27px] leading-none font-extrabold tracking-[-0.03em] text-white">
              {loading ? "₦—" : formatNaira(available)}
            </p>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/[0.07] text-white/80">
            <ArrowUpRight className="h-[22px] w-[22px]" strokeWidth={2} />
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="le-rise mt-5 flex flex-col gap-3.5"
        style={{ animationDelay: "120ms" }}
        noValidate
      >
        <FloatingField
          id="wd-amount"
          label="Amount"
          value={amount}
          onChange={(v) => setAmount(v.replace(/[^\d.]/g, ""))}
          inputMode="decimal"
          prefix="₦"
          error={errors.amount}
          hint={`Up to ${formatNaira(available)}`}
        />

        <FloatingField
          id="wd-account-number"
          label="Account Number"
          value={accountNumber}
          onChange={(v) => setAccountNumber(v.replace(/\D/g, ""))}
          inputMode="numeric"
          maxLength={10}
          error={errors.accountNumber}
          hint="10 digits, numbers only"
        />

        <FloatingField
          id="wd-account-name"
          label="Account Name"
          value={accountName}
          onChange={setAccountName}
          error={errors.accountName}
        />

        {/* Bank selector */}
        <div>
          <div
            className={`group relative rounded-2xl border bg-white/[0.03] transition-all duration-300 focus-within:bg-white/[0.055] ${
              errors.bankName
                ? "border-[#F87171]/55 focus-within:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]"
                : "border-white/[0.09] focus-within:border-[#8B5CF6]/70 focus-within:shadow-[0_0_0_4px_rgba(139,92,246,0.14)]"
            }`}
          >
            <label
              htmlFor="wd-bank"
              className={`pointer-events-none absolute left-4 z-10 font-medium transition-all duration-200 ${
                bankName
                  ? "top-2 text-[10px] tracking-[0.05em] text-white/40 uppercase"
                  : "top-1/2 -translate-y-1/2 text-[13px] text-white/35"
              } group-focus-within:top-2 group-focus-within:translate-y-0 group-focus-within:text-[10px] group-focus-within:tracking-[0.05em] group-focus-within:text-[#C4B5FD] group-focus-within:uppercase`}
            >
              Select Bank
            </label>

            <select
              id="wd-bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              aria-invalid={!!errors.bankName}
              className="w-full appearance-none bg-transparent pt-6 pr-11 pb-2.5 pl-4 font-display text-[15px] font-semibold text-white outline-none"
            >
              <option value="" disabled className="bg-[#14141B]" />
              {NIGERIAN_BANKS.map((bank) => (
                <option key={bank} value={bank} className="bg-[#14141B] text-white">
                  {bank}
                </option>
              ))}
            </select>

            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-white/35"
              strokeWidth={2.2}
            />
          </div>

          {errors.bankName && (
            <p
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 pl-1 text-[11px] font-medium text-[#FCA5A5]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
              {errors.bankName}
            </p>
          )}
        </div>

        <div>
          <FloatingField
            id="wd-code"
            label="Security Verification Code"
            value={verificationCode}
            onChange={(v) => setVerificationCode(v.toUpperCase())}
            maxLength={19}
            error={errors.verificationCode}
          />

          <button
            type="button"
            onClick={handleSendCode}
            disabled={sendingCode}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/[0.09] py-2.5 text-[12px] font-semibold text-[#C4B5FD] transition-all duration-300 hover:bg-[#8B5CF6]/[0.16] hover:text-white active:scale-[0.98] disabled:opacity-60"
          >
            {sendingCode ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.3} />
            ) : (
              <Send className="h-3.5 w-3.5" strokeWidth={2.3} />
            )}
            {sendingCode ? "Sending…" : "Email me a code"}
          </button>

          {codeSentTo && (
            <p
              role="status"
              className="mt-2 flex items-center gap-1.5 pl-1 text-[11px] font-medium text-[#4ADE80]"
            >
              <MailCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
              Code sent to {codeSentTo}. It expires in 10 minutes.
            </p>
          )}
        </div>

        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-2xl border border-[#F87171]/35 bg-[#F87171]/[0.09] p-3.5"
          >
            <AlertCircle className="mt-px h-4 w-4 shrink-0 text-[#FCA5A5]" strokeWidth={2.2} />
            <p className="text-[12px] leading-relaxed font-medium text-[#FCA5A5]">
              {formError}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || loading}
          className="group relative mt-1 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-4 shadow-[0_16px_40px_-14px_rgba(124,77,255,0.95)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_20px_50px_-12px_rgba(124,77,255,1)] active:scale-[0.975] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            aria-hidden
            className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
          {submitting && (
            <Loader2 className="relative h-[18px] w-[18px] animate-spin text-white" />
          )}
          <span className="relative font-display text-[15.5px] font-bold tracking-[-0.01em] text-white">
            {submitting ? "Submitting…" : "Request withdrawal"}
          </span>
        </button>
      </form>

      <div
        className="le-rise mt-4 flex items-start gap-3 rounded-2xl border border-[#8B5CF6]/22 bg-[#8B5CF6]/[0.07] p-4"
        style={{ animationDelay: "220ms" }}
      >
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#A78BFA]" strokeWidth={2.1} />
        <p className="text-[11.5px] leading-relaxed text-white/55">
          The verification code is free and is emailed to the address on your account.
          Requests are reviewed by our payouts desk, normally within 24 hours. We will
          never sell you a code or charge a fee to release a withdrawal — if anyone asks
          you to pay, it is a scam. Report it on the{" "}
          <Link
            href="/support"
            className="font-semibold text-[#C4B5FD] underline underline-offset-2"
          >
            Support page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
