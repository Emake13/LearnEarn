"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Crown, Loader2, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { formatNairaShort } from "@/lib/learnearn-config";
import type { UpgradeTier } from "@/types/learnearn";
import { PageHeader } from "./page-header";
import { useAppState } from "./app-state";

/** Splits the stored benefits blob into individual lines. */
function benefitLines(tier: UpgradeTier): string[] {
  return (tier.benefits || "")
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);
}

/** Tier comparison with a call to action that routes into the payment flow. */
export function UpgradeView() {
  const router = useRouter();
  const { profile } = useAppState();
  const [tiers, setTiers] = useState<UpgradeTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await api.get<UpgradeTier[]>("/api/tiers");
      if (res.ok && res.data) {
        setTiers(res.data);
      } else {
        console.error("[UpgradeView] could not load tiers:", res.error);
        setError(String(res.error || "Could not load the tiers."));
      }
      setLoading(false);
    })();
  }, []);

  const currentLevel = profile?.level ?? 1;

  return (
    <div className="pb-4">
      <PageHeader
        title="Upgrade your tier"
        subtitle="Move up a level to raise your earning ceiling and get paid the moment you ask."
      />

      {loading && (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#A78BFA]" />
        </div>
      )}

      {error && (
        <p role="alert" className="mt-6 text-[12.5px] font-medium text-[#FCA5A5]">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {tiers.map((tier, i) => {
          const isCurrent = tier.level === currentLevel;
          const isPro = tier.level > currentLevel;
          const accent = tier.accent_color || "#8B5CF6";

          return (
            <article
              key={tier._id}
              className={`le-rise le-grain relative overflow-hidden rounded-[26px] p-5 ${
                isPro ? "le-glass" : "le-panel"
              }`}
              style={{ animationDelay: `${80 + i * 90}ms` }}
            >
              {isPro && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-14 -right-10 h-48 w-48 rounded-full opacity-30 blur-[60px]"
                  style={{ backgroundColor: accent }}
                />
              )}

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${accent}, ${accent}55)`,
                      }}
                    >
                      {isPro ? (
                        <Crown className="h-[17px] w-[17px] text-white" strokeWidth={2.2} />
                      ) : (
                        <Zap className="h-[17px] w-[17px] text-white" strokeWidth={2.2} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-[17px] font-bold tracking-[-0.02em] text-white">
                        Level {tier.level} — {tier.name}
                      </h2>
                      {tier.tagline && (
                        <p className="truncate text-[11.5px] text-white/45">{tier.tagline}</p>
                      )}
                    </div>
                  </div>
                </div>

                {isCurrent && (
                  <span className="shrink-0 rounded-full border border-[#4ADE80]/30 bg-[#4ADE80]/12 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#4ADE80] uppercase">
                    Current
                  </span>
                )}
              </div>

              <div className="relative mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
                  <p className="text-[10px] font-semibold tracking-wide text-white/40 uppercase">
                    Daily limit
                  </p>
                  <p className="le-tnum mt-1 font-display text-[15px] font-extrabold text-white">
                    {formatNairaShort(tier.daily_earning_limit)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
                  <p className="text-[10px] font-semibold tracking-wide text-white/40 uppercase">
                    Withdrawals
                  </p>
                  <p className="mt-1 font-display text-[15px] font-extrabold text-white">
                    {tier.withdrawal_speed || "—"}
                  </p>
                </div>
              </div>

              <ul className="relative mt-4 flex flex-col gap-2">
                {benefitLines(tier).map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                      style={{ backgroundColor: `${accent}33` }}
                    >
                      <Check className="h-2.5 w-2.5" style={{ color: accent }} strokeWidth={3.5} />
                    </span>
                    <span className="text-[12.5px] leading-snug text-white/65">{benefit}</span>
                  </li>
                ))}
              </ul>

              {isPro && (
                <button
                  type="button"
                  onClick={() => {
                    console.log("[UpgradeView] upgrading to tier", tier._id);
                    router.push(
                      `/payment?purpose=upgrade&tier=${tier._id}&amount=${tier.price}`
                    );
                  }}
                  className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-3.5 shadow-[0_16px_40px_-14px_rgba(124,77,255,0.95)] transition-all duration-300 hover:brightness-110 active:scale-[0.975]"
                >
                  <span
                    aria-hidden
                    className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  />
                  <span className="relative font-display text-[15px] font-bold text-white">
                    Upgrade Now — {formatNairaShort(tier.price)}
                  </span>
                  <ArrowRight className="relative h-[17px] w-[17px] text-white transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
