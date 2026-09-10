"use client";

import { useState } from "react";
import { CheckCircle2, Gift, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { formatNairaShort, WELCOME_REWARD } from "@/lib/learnearn-config";
import type { MeProfile } from "@/types/learnearn";
import { useAppState } from "./app-state";

/** Rewards strip: gift mark, message and an amber-gold claim pill. */
export function RewardsBanner() {
  const { profile, setProfile } = useAppState();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const claimed = profile?.rewardClaimed ?? false;

  const handleClaim = async () => {
    if (submitting || claimed) return;
    setSubmitting(true);
    setError("");
    console.log("[RewardsBanner] claiming welcome reward");

    const res = await api.post<MeProfile>("/api/rewards/claim", {});

    if (res.ok && res.data) {
      setProfile(res.data);
    } else {
      console.error("[RewardsBanner] claim failed:", res.error);
      setError(String(res.error || "Could not claim your reward."));
    }
    setSubmitting(false);
  };

  return (
    <section
      className="le-rise le-panel le-grain relative mt-4 overflow-hidden rounded-[24px] p-4"
      style={{ animationDelay: "220ms" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#F5B301] opacity-[0.13] blur-[55px]"
      />

      <div className="relative flex items-center gap-3.5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#FDE68A] to-[#F5B301] shadow-[0_10px_26px_-10px_rgba(245,179,1,0.95)]">
          {claimed ? (
            <CheckCircle2 className="h-[22px] w-[22px] text-[#5C3703]" strokeWidth={2.2} />
          ) : (
            <Gift className="h-[22px] w-[22px] text-[#5C3703]" strokeWidth={2.2} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[14.5px] leading-tight font-bold tracking-[-0.01em] text-white">
            {claimed ? "Reward claimed" : "Claim your rewards"}
          </p>
          <p className="mt-1 text-[11.5px] leading-snug text-white/45">
            {claimed
              ? "It's already in your balance. Nice one!"
              : "Tap below to unlock your bonus"}
          </p>
        </div>

        {claimed ? (
          <span className="shrink-0 rounded-full border border-[#4ADE80]/30 bg-[#4ADE80]/12 px-3.5 py-2 text-[11px] font-bold text-[#4ADE80]">
            Claimed
          </span>
        ) : (
          <button
            type="button"
            onClick={handleClaim}
            disabled={submitting}
            className="group relative shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-[#FCD34D] to-[#F0A500] px-4 py-2.5 shadow-[0_12px_28px_-12px_rgba(245,179,1,1)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_16px_34px_-10px_rgba(245,179,1,1)] active:scale-95 disabled:opacity-70"
          >
            <span
              aria-hidden
              className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            />
            {submitting ? (
              <Loader2 className="relative mx-auto h-4 w-4 animate-spin text-[#4A2C02]" />
            ) : (
              <span className="relative flex flex-col items-center leading-none">
                <span className="font-display text-[12px] font-extrabold text-[#4A2C02]">
                  Claim
                </span>
                <span className="le-tnum mt-0.5 font-display text-[13px] font-extrabold text-[#3A2201]">
                  {formatNairaShort(WELCOME_REWARD)}
                </span>
              </span>
            )}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="relative mt-2.5 text-[11.5px] font-medium text-[#FCA5A5]">
          {error}
        </p>
      )}
    </section>
  );
}
