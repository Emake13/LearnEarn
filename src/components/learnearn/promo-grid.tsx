"use client";

import Link from "next/link";
import { Crown, ShieldCheck, Trophy, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Promo = {
  title: string;
  body: string;
  href: string;
  icon: LucideIcon;
  /** Gradient used for both the glow border and the icon chip. */
  gradient: string;
  glow: string;
};

const PROMOS: Promo[] = [
  {
    title: "Upgrade to Premium",
    body: "Unlock 5x faster earning tasks and instant priority withdrawals.",
    href: "/upgrade",
    icon: Crown,
    gradient: "from-[#A78BFA] via-[#7C3AED] to-[#4F46E5]",
    glow: "rgba(139,92,246,0.55)",
  },
  {
    title: "Invite & Earn",
    body: "Get a ₦2,000 bonus for every active peer who signs up using your link.",
    href: "/profile",
    icon: UserPlus,
    gradient: "from-[#22D3EE] via-[#38BDF8] to-[#6366F1]",
    glow: "rgba(34,211,238,0.5)",
  },
  {
    title: "Leaderboard Stars",
    body: "See this week's top earners and unlock exclusive server badges.",
    href: "/earn",
    icon: Trophy,
    gradient: "from-[#FDE68A] via-[#F5B301] to-[#F97316]",
    glow: "rgba(245,179,1,0.5)",
  },
  {
    title: "Secure Vault",
    body: "Activate multi-factor authentication to protect your wallet balance.",
    href: "/profile",
    icon: ShieldCheck,
    gradient: "from-[#4ADE80] via-[#22D3EE] to-[#0EA5E9]",
    glow: "rgba(74,222,128,0.45)",
  },
];

/** Promotional banner cards sitting under the Quick Access grid. */
export function PromoGrid() {
  return (
    <section className="le-rise mt-7" style={{ animationDelay: "360ms" }}>
      <h2 className="font-display text-[15px] font-bold tracking-[-0.01em] text-white">
        For you
      </h2>

      <div className="mt-3.5 grid grid-cols-2 gap-3">
        {PROMOS.map(({ title, body, href, icon: Icon, gradient, glow }, i) => (
          <Link
            key={title}
            href={href}
            className="group relative block rounded-[20px] p-px transition-transform duration-300 hover:-translate-y-1 active:scale-[0.97]"
            style={{ animationDelay: `${380 + i * 70}ms` }}
          >
            {/* Gradient glow border */}
            <span
              aria-hidden
              className={`absolute inset-0 rounded-[20px] bg-gradient-to-br ${gradient} opacity-55 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <span
              aria-hidden
              className="absolute -inset-1 rounded-[24px] opacity-0 blur-[16px] transition-opacity duration-300 group-hover:opacity-70"
              style={{ backgroundColor: glow }}
            />

            <span className="le-grain relative flex h-full flex-col rounded-[19px] bg-[#101017] p-3.5">
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${gradient} shadow-[0_8px_20px_-10px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon className="h-[17px] w-[17px] text-white" strokeWidth={2.1} />
              </span>

              <span className="mt-3 block font-display text-[12.5px] leading-tight font-bold tracking-[-0.01em] text-white">
                {title}
              </span>
              <span className="mt-1.5 block text-[10.5px] leading-[1.45] text-white/45">
                {body}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
