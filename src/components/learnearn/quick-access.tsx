"use client";

import { Headphones, KeyRound, TrendingUp, WalletMinimal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type QuickAction = {
  label: string;
  icon: LucideIcon;
  /** Tailwind gradient stops for the icon medallion. */
  gradient: string;
  /** Matching ambient glow colour. */
  glow: string;
};

const ACTIONS: QuickAction[] = [
  {
    label: "Upgrade",
    icon: TrendingUp,
    gradient: "from-[#A78BFA] to-[#7C3AED]",
    glow: "rgba(139,92,246,0.85)",
  },
  {
    label: "Earn More",
    icon: WalletMinimal,
    gradient: "from-[#8B5CF6] to-[#5B21B6]",
    glow: "rgba(124,58,237,0.8)",
  },
  {
    label: "Support",
    icon: Headphones,
    gradient: "from-[#38BDF8] to-[#6366F1]",
    glow: "rgba(56,189,248,0.75)",
  },
  {
    label: "BUY Naira Code",
    icon: KeyRound,
    gradient: "from-[#22D3EE] to-[#8B5CF6]",
    glow: "rgba(34,211,238,0.7)",
  },
];

/**
 * Four premium shortcut tiles under a compact section heading.
 */
export function QuickAccess() {
  return (
    <section className="le-rise mt-7" style={{ animationDelay: "300ms" }}>
      <h2 className="font-display text-[15px] font-bold tracking-[-0.01em] text-white">
        Quick Access
      </h2>

      <div className="mt-3.5 grid grid-cols-4 gap-2.5">
        {ACTIONS.map(({ label, icon: Icon, gradient, glow }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => console.log("[QuickAccess] action tapped:", label)}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-1.5 py-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06] active:scale-95"
            style={{ animationDelay: `${340 + i * 60}ms` }}
          >
            <span className="relative">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full opacity-0 blur-[12px] transition-opacity duration-300 group-hover:opacity-70"
                style={{ backgroundColor: glow }}
              />
              <span
                className={`relative grid h-[46px] w-[46px] place-items-center rounded-full bg-gradient-to-br ${gradient} shadow-[0_10px_24px_-12px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon className="h-[21px] w-[21px] text-white" strokeWidth={2} />
              </span>
            </span>

            <span className="text-center text-[10.5px] leading-[1.25] font-semibold text-white/70 transition-colors duration-300 group-hover:text-white">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
