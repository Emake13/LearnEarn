"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** A labelled, tap-to-copy value block used for the bank account details. */
export function CopyField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      console.log("[CopyField] copied", label);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      // Clipboard can be blocked (insecure origin, permissions) — surface it.
      console.error("[CopyField] clipboard write failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-left transition-all duration-300 hover:border-[#8B5CF6]/45 hover:bg-white/[0.07] active:scale-[0.985]"
    >
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold tracking-[0.12em] text-white/40 uppercase">
          {label}
        </span>
        <span
          className={`mt-1 block truncate text-[15px] font-bold text-white ${
            mono ? "le-tnum tracking-[0.06em]" : ""
          }`}
        >
          {value}
        </span>
      </span>

      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-all duration-300 ${
          copied
            ? "bg-[#4ADE80]/18 text-[#4ADE80]"
            : "bg-white/[0.06] text-white/50 group-hover:text-white"
        }`}
      >
        {copied ? (
          <Check className="h-4 w-4" strokeWidth={2.6} />
        ) : (
          <Copy className="h-[15px] w-[15px]" strokeWidth={2} />
        )}
      </span>
    </button>
  );
}
