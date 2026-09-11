"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, MailCheck } from "lucide-react";
import { forgetPassword } from "@/lib/auth-client";
import { AuthField, AuthShell, AuthSubmit } from "@/components/learnearn/auth-shell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim()) {
      setFieldError("Enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError("That email address doesn't look right.");
      return;
    }
    setFieldError("");

    setLoading(true);
    try {
      const result = await forgetPassword({
        email: email.trim(),
        redirectTo: "/reset-password",
      });

      if (result.error) {
        console.error("[forgot-password] request failed:", result.error);
        setFormError(result.error.message || "Could not send the reset link. Please try again.");
        setLoading(false);
        return;
      }

      console.log("[forgot-password] reset link requested");
      setSent(true);
      setLoading(false);
    } catch (err: any) {
      console.error("[forgot-password] unexpected error:", err);
      setFormError(err?.message || "Could not send the reset link. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={sent ? "Check your inbox" : "Forgot your password?"}
      subtitle={
        sent
          ? "We've sent you a secure link to choose a new password."
          : "Enter the email you signed up with and we'll send you a reset link."
      }
      footer={
        <p className="text-[12.5px] text-white/45">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#C4B5FD] transition-colors duration-300 hover:text-white"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[#4ADE80]/28 bg-[#4ADE80]/12 text-[#4ADE80]">
            <MailCheck className="h-6 w-6" strokeWidth={2} />
          </span>
          <p className="font-display text-[15px] font-bold text-white">Link on its way</p>
          <p className="max-w-[17rem] text-[12px] leading-relaxed text-white/50">
            If an account exists for <span className="font-semibold text-white/80">{email.trim()}</span>,
            you'll get an email with a reset link. It expires in one hour.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-[#F87171]/28 bg-[#F87171]/[0.09] p-3.5"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F87171]" strokeWidth={2.2} />
              <p className="text-[12px] leading-relaxed font-medium text-[#FCA5A5]">{formError}</p>
            </div>
          )}

          <AuthField
            id="email"
            label="Email Address"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (fieldError) setFieldError("");
            }}
            error={fieldError}
          />

          <AuthSubmit loading={loading} loadingLabel="Sending link…">
            Send Reset Link
          </AuthSubmit>
        </form>
      )}
    </AuthShell>
  );
}
