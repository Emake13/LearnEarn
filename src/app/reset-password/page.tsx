"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/lib/auth-client";
import { AuthField, AuthShell, AuthSubmit } from "@/components/learnearn/auth-shell";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const next: { password?: string; confirm?: string } = {};
    if (!password) next.password = "Choose a new password.";
    else if (password.length < 6) next.password = "Use at least 6 characters.";
    if (confirm !== password) next.confirm = "Both passwords must match.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!token) {
      setFormError("This reset link is invalid or has expired. Request a new one.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({ token, newPassword: password });

      if (result.error) {
        console.error("[reset-password] failed:", result.error);
        setFormError(
          result.error.message || "This reset link is invalid or has expired. Request a new one."
        );
        setLoading(false);
        return;
      }

      console.log("[reset-password] password updated");
      setDone(true);
      setLoading(false);
    } catch (err: any) {
      console.error("[reset-password] unexpected error:", err);
      setFormError(err?.message || "Could not update your password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={done ? "Password updated" : "Set a new password"}
      subtitle={
        done
          ? "You can now sign in with your new password."
          : "Choose a strong password you haven't used before."
      }
      footer={
        <p className="text-[12.5px] text-white/45">
          <Link
            href="/login"
            className="font-semibold text-[#C4B5FD] transition-colors duration-300 hover:text-white"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[#4ADE80]/28 bg-[#4ADE80]/12 text-[#4ADE80]">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </span>
          <p className="font-display text-[15px] font-bold text-white">All set</p>
          <Link
            href="/login"
            className="mt-1 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] px-6 py-3 font-display text-[13.5px] font-bold text-white shadow-[0_14px_34px_-12px_rgba(124,58,237,0.95)] transition-all duration-300 hover:brightness-110 active:scale-95"
          >
            Sign in now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {(formError || !token) && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-[#F87171]/28 bg-[#F87171]/[0.09] p-3.5"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F87171]" strokeWidth={2.2} />
              <p className="text-[12px] leading-relaxed font-medium text-[#FCA5A5]">
                {formError ||
                  "This link is missing its reset token. Request a fresh one from the Forgot Password page."}
              </p>
            </div>
          )}

          <AuthField
            id="password"
            label="New Password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
            }}
            error={errors.password}
            trailing={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="grid h-7 w-7 place-items-center rounded-full text-white/40 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-90"
              >
                {show ? (
                  <EyeOff className="h-[15px] w-[15px]" strokeWidth={2} />
                ) : (
                  <Eye className="h-[15px] w-[15px]" strokeWidth={2} />
                )}
              </button>
            }
          />

          <AuthField
            id="confirm"
            label="Confirm Password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your new password"
            value={confirm}
            onChange={(v) => {
              setConfirm(v);
              if (errors.confirm) setErrors((e) => ({ ...e, confirm: undefined }));
            }}
            error={errors.confirm}
          />

          <AuthSubmit loading={loading} loadingLabel="Updating…">
            Update Password
          </AuthSubmit>
        </form>
      )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#0B0B0F] text-[13px] text-white/40">
          Loading…
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
