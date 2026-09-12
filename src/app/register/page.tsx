"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Gift, Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { AuthField, AuthShell, AuthSubmit } from "@/components/learnearn/auth-shell";

const DUPLICATE_MESSAGE =
  "An account with this email already exists. Please log in instead.";
const SIGNUP_TIMEOUT_MS = 60_000;

/** True when Better Auth rejected the sign-up because the email is taken. */
function isDuplicateEmail(error: any): boolean {
  const code = String(error?.code || "").toUpperCase();
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.status === 422 ||
    code.includes("USER_ALREADY_EXISTS") ||
    code.includes("EMAIL_ALREADY") ||
    message.includes("already exists") ||
    message.includes("already registered") ||
    message.includes("already in use") ||
    message.includes("user already")
  );
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [loading, setLoading] = useState(false);

  const clear = (key: keyof FieldErrors) => {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next: FieldErrors = {};

    if (!name.trim()) next.name = "Tell us your full name.";
    else if (name.trim().length < 3) next.name = "That name looks too short.";

    if (!email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That email address doesn't look right.";

    const digits = phone.replace(/\D/g, "");
    if (!phone.trim()) next.phone = "Enter your phone number.";
    else if (digits.length < 10) next.phone = "Enter a valid phone number.";

    if (!password) next.password = "Choose a password.";
    else if (password.length < 6) next.password = "Use at least 6 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setDuplicate(false);
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await Promise.race([
        signUp.email({
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim(),
          referral_code: referral.trim().toUpperCase(),
        } as any),
        new Promise<never>((_, reject) =>
          window.setTimeout(() => reject(new Error("SIGNUP_TIMEOUT")), SIGNUP_TIMEOUT_MS),
        ),
      ]);

      if (result.error) {
        console.error("[register] sign up failed:", result.error);
        if (isDuplicateEmail(result.error)) {
          setDuplicate(true);
          setFormError(DUPLICATE_MESSAGE);
        } else {
          setFormError("Could not create your account. Please check your details and try again.");
        }
        setLoading(false);
        return;
      }

      // The sign-up response has already set the session cookie. Navigate
      // immediately so the server-rendered home page can load the dashboard.
      window.location.assign("/");
    } catch (err: any) {
      console.error("[register] sign up failed:", err);
      if (isDuplicateEmail(err)) {
        setDuplicate(true);
        setFormError(DUPLICATE_MESSAGE);
      } else if (err?.message === "SIGNUP_TIMEOUT") {
        setFormError("Creating your account took too long. Please try again.");
      } else {
        setFormError("Could not create your account. Please check your details and try again.");
      }
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join LearnEarn and start turning learning into naira."
      footer={
        <p className="text-[12.5px] text-white/45">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#C4B5FD] transition-colors duration-300 hover:text-white"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {formError && (
          <div
            role="alert"
            className="le-rise flex flex-col gap-3 rounded-2xl border border-[#F87171]/28 bg-[#F87171]/[0.09] p-3.5"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F87171]" strokeWidth={2.2} />
              <p className="text-[12px] leading-relaxed font-medium text-[#FCA5A5]">{formError}</p>
            </div>

            {duplicate && (
              <Link
                href={`/login?email=${encodeURIComponent(email.trim())}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-2.5 font-display text-[13px] font-bold text-white transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.4} />
                Taking you to sign in…
              </Link>
            )}
          </div>
        )}

        <AuthField
          id="name"
          label="Full Name"
          autoComplete="name"
          placeholder="Jame Okafor"
          value={name}
          onChange={(v) => {
            setName(v);
            clear("name");
          }}
          error={errors.name}
        />

        <AuthField
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(v) => {
            setEmail(v);
            clear("email");
          }}
          error={errors.email}
        />

        <AuthField
          id="phone"
          label="Phone Number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0801 234 5678"
          value={phone}
          onChange={(v) => {
            setPhone(v);
            clear("phone");
          }}
          error={errors.phone}
        />

        <AuthField
          id="password"
          label="Password"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(v) => {
            setPassword(v);
            clear("password");
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
          id="referral_code"
          label="Referral Code"
          optional
          autoComplete="off"
          placeholder="e.g. LEARN2026"
          value={referral}
          onChange={(v) => setReferral(v.toUpperCase())}
          trailing={<Gift className="h-4 w-4 text-[#FBBF24]" strokeWidth={2} />}
        />

        <AuthSubmit loading={loading} loadingLabel="Creating account…">
          Create Account
        </AuthSubmit>

        <p className="text-center text-[10.5px] leading-relaxed text-white/30">
          By continuing you agree to our{" "}
          <Link href="/terms-of-service" className="text-white/50 underline underline-offset-2">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-white/50 underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
