"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Gift } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { AuthField, AuthShell, AuthSubmit } from "@/components/learnearn/auth-shell";

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
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
        phone: phone.trim(),
        referral_code: referral.trim().toUpperCase(),
      } as any);

      if (result.error) {
        console.error("[register] sign up failed:", result.error);
        setFormError(
          result.error.message || "Could not create your account. That email may already be in use."
        );
        setLoading(false);
        return;
      }

      console.log("[register] account created, entering dashboard");
      window.location.href = "/";
    } catch (err: any) {
      console.error("[register] unexpected error:", err);
      setFormError(err?.message || "Could not create your account. Please try again.");
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
            className="flex items-start gap-2.5 rounded-2xl border border-[#F87171]/28 bg-[#F87171]/[0.09] p-3.5"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F87171]" strokeWidth={2.2} />
            <p className="text-[12px] leading-relaxed font-medium text-[#FCA5A5]">{formError}</p>
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
