"use client";

import Link from "next/link";
import { AmbientGlow } from "./ambient-glow";
import { Logo } from "./logo";

/** Shared frame for the login / register / password screens. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <AmbientGlow />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-10 pb-10">
        <Link href="/" className="le-rise self-center transition-transform duration-300 active:scale-95">
          <Logo />
        </Link>

        <div className="le-rise mt-9" style={{ animationDelay: "70ms" }}>
          <h1 className="font-display text-[27px] leading-tight font-extrabold tracking-[-0.03em] text-white">
            {title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">{subtitle}</p>
        </div>

        <div
          className="le-rise le-glass le-grain relative mt-6 overflow-hidden rounded-[26px] p-5"
          style={{ animationDelay: "130ms" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-12 h-52 w-52 rounded-full bg-[#7C3AED] opacity-35 blur-[70px]"
          />
          <div className="relative">{children}</div>
        </div>

        {footer && (
          <div className="le-rise mt-6 text-center" style={{ animationDelay: "200ms" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Dark-themed labelled input with inline validation styling. */
export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  optional,
  autoComplete,
  inputMode,
  trailing,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  optional?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.02em] text-white/55"
      >
        {label}
        {optional && (
          <span className="text-[10px] font-medium text-white/30">(Optional)</span>
        )}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-2xl border bg-white/[0.04] px-4 py-3.5 text-[14px] font-medium text-white placeholder:text-white/25 transition-all duration-300 outline-none ${
            trailing ? "pr-12" : ""
          } ${
            error
              ? "border-[#F87171]/55 focus:border-[#F87171] focus:bg-[#F87171]/[0.06] focus:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]"
              : "border-white/[0.09] focus:border-[#8B5CF6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(139,92,246,0.14)]"
          }`}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-3 flex items-center">{trailing}</div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[11.5px] font-medium text-[#FCA5A5]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Primary violet submit button used across the auth screens. */
export function AuthSubmit({
  loading,
  children,
  loadingLabel,
}: {
  loading: boolean;
  children: React.ReactNode;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#4F46E5] py-3.5 font-display text-[14.5px] font-bold text-white shadow-[0_14px_34px_-12px_rgba(124,58,237,0.95)] transition-all duration-300 hover:brightness-110 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden
        className="le-sheen pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.35)_50%,transparent_65%)]"
      />
      <span className="relative">{loading ? loadingLabel : children}</span>
    </button>
  );
}
