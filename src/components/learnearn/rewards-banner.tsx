"use client";

import { Gift } from "lucide-react";

/**
 * Rewards strip: gift mark, two-line message and an amber-gold claim pill.
 */
export function RewardsBanner({ amount = "₦96,000" }: { amount?: string }) {
  const handleClaim = () => {
    console.log("[RewardsBanner] claim tapped", { amount });
  };

  return (
    <section
      className="le-rise le-panel le-grain relative mt-4 overflow-hidden rounded-[24px] p-4"
      style={{ animationDelay: "220ms" }}
    >
      {/* Warm gold wash behind the claim button */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#F5B301] opacity-[0.13] blur-[55px]"
      />

      <div className="relative flex items-center gap-3.5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#FDE68A] to-[#F5B301] shadow-[0_10px_26px_-10px_rgba(245,179,1,0.95)]">
          <Gift className="h-[22px] w-[22px] text-[#5C3703]" strokeWidth={2.2} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[14.5px] leading-tight font-bold tracking-[-0.01em] text-white">
            Claim your rewards
          </p>
          <p className="mt-1 text-[11.5px] leading-snug text-white/45">
            Tap below to unlock your bonus
          </p>
        </div>

        <button
          type="button"
          onClick={handleClaim}
          className="group relative shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-[#FCD34D] to-[#F0A500] px-4 py-2.5 shadow-[0_12px_28px_-12px_rgba(245,179,1,1)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_16px_34px_-10px_rgba(245,179,1,1)] active:scale-95"
        >
          <span
            aria-hidden
            className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent"
          />
          <span className="relative flex flex-col items-center leading-none">
            <span className="font-display text-[12px] font-extrabold text-[#4A2C02]">
              Claim
            </span>
            <span className="le-tnum mt-0.5 font-display text-[13px] font-extrabold text-[#3A2201]">
              {amount}
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}
