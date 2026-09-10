"use client";

import { GraduationCap, Home, NotebookText, User, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TabKey = "home" | "earn" | "activity" | "wallet" | "profile";

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "earn", label: "Earn", icon: GraduationCap },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "profile", label: "Profile", icon: User },
];

/**
 * Floating blurred-glass bottom bar with a raised, glowing centre action button.
 */
export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const select = (tab: TabKey) => {
    console.log("[BottomNav] tab selected:", tab);
    onChange(tab);
  };

  const renderTab = ({ key, label, icon: Icon }: (typeof TABS)[number]) => {
    const isActive = active === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => select(key)}
        aria-current={isActive ? "page" : undefined}
        className="group relative flex flex-1 flex-col items-center gap-1 py-1 transition-transform duration-300 active:scale-90"
      >
        {isActive && (
          <span
            aria-hidden
            className="absolute top-0 h-8 w-12 rounded-full bg-[#8B5CF6] opacity-45 blur-[14px]"
          />
        )}
        <Icon
          className={`h-[21px] w-[21px] transition-all duration-300 ${
            isActive
              ? "text-[#A78BFA] drop-shadow-[0_0_10px_rgba(167,139,250,0.75)]"
              : "text-white/40 group-hover:text-white/80"
          }`}
          strokeWidth={isActive ? 2.3 : 1.9}
        />
        <span
          className={`text-[10px] font-semibold tracking-[0.01em] transition-colors duration-300 ${
            isActive ? "text-[#C4B5FD]" : "text-white/40 group-hover:text-white/70"
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  const isCentreActive = active === "activity";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      {/* Fade so page content dissolves behind the bar instead of hard-clipping */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/80 to-transparent"
      />

      <div className="relative w-full max-w-md">
        <div className="relative flex items-end rounded-[26px] border border-white/[0.09] bg-white/[0.055] px-3 pt-3 pb-3 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-2xl backdrop-saturate-150">
          {TABS.slice(0, 2).map(renderTab)}

          {/* Centre action — raised, glowing */}
          <div className="relative flex w-[70px] shrink-0 justify-center">
            <button
              type="button"
              onClick={() => select("activity")}
              aria-label="Open activity log"
              aria-current={isCentreActive ? "page" : undefined}
              className="group absolute -top-[38px] grid h-[58px] w-[58px] place-items-center rounded-full border-[5px] border-[#0B0B0F] bg-gradient-to-br from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9] shadow-[0_12px_34px_-8px_rgba(139,92,246,1)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span
                aria-hidden
                className="le-breathe absolute -inset-1.5 -z-10 rounded-full bg-[#8B5CF6] blur-[14px]"
              />
              <NotebookText
                className="h-[23px] w-[23px] text-white transition-transform duration-300 group-hover:-rotate-6"
                strokeWidth={2.1}
              />
            </button>
          </div>

          {TABS.slice(2).map(renderTab)}
        </div>
      </div>
    </nav>
  );
}
