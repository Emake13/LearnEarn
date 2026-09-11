"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clearClientState } from "@/lib/session-reset";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { AuthField, AuthShell, AuthSubmit } from "@/components/learnearn/auth-shell";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  // Prefilled when we bounce someone here from a duplicate registration.
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That email address doesn't look right.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await signIn.email({ email: email.trim(), password });

      if (result.error) {
        console.error("[login] sign in failed:", result.error);
        setFormError(result.error.message || "Wrong email or password. Please try again.");
        setLoading(false);
        return;
      }

      console.log("[login] signed in, redirecting to", redirect);
      clearClientState();
      setTimeout(() => {
        window.location.href = redirect;
      }, 400);
    } catch (err: any) {
      console.error("[login] unexpected error:", err);
      setFormError(err?.message || "Could not sign you in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back 👋"
      subtitle="Sign in to keep learning, earning and growing."
      footer={
        <p className="text-[12.5px] text-white/45">
          New to LearnEarn?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#C4B5FD] transition-colors duration-300 hover:text-white"
          >
            Create an account
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
          id="email"
          label="Email Address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
          }}
          error={errors.email}
        />

        <div>
          <AuthField
            id="password"
            label="Password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
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
          <div className="mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[11.5px] font-semibold text-[#A78BFA] transition-colors duration-300 hover:text-white"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <AuthSubmit loading={loading} loadingLabel="Signing in…">
          Sign In
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#0B0B0F] text-[13px] text-white/40">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
