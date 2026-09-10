"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Home, NotebookText, User, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/earn", label: "Earn", icon: GraduationCap },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
];

const CENTRE_HREF = "/activity";

/**
 * Floating blurred-glass bottom bar with a raised, glowing centre action.
 * Active state is derived from the current route.
 */
export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderTab = ({ href, label, icon: Icon }: (typeof TABS)[number]) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className="group relative flex flex-1 flex-col items-center gap-1 py-1 transition-transform duration-300 active:scale-90"
      >
        {active && (
          <span
            aria-hidden
            className="absolute top-0 h-8 w-12 rounded-full bg-[#8B5CF6] opacity-45 blur-[14px]"
          />
        )}
        <Icon
          className={`h-[21px] w-[21px] transition-all duration-300 ${
            active
              ? "text-[#A78BFA] drop-shadow-[0_0_10px_rgba(167,139,250,0.75)]"
              : "text-white/40 group-hover:text-white/80"
          }`}
          strokeWidth={active ? 2.3 : 1.9}
        />
        <span
          className={`text-[10px] font-semibold tracking-[0.01em] transition-colors duration-300 ${
            active ? "text-[#C4B5FD]" : "text-white/40 group-hover:text-white/70"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/80 to-transparent"
      />

      <div className="relative w-full max-w-md">
        <div className="relative flex items-end rounded-[26px] border border-white/[0.09] bg-white/[0.055] px-3 pt-3 pb-3 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-2xl backdrop-saturate-150">
          {TABS.slice(0, 2).map(renderTab)}

          {/* Centre action — raised and glowing */}
          <div className="relative flex w-[70px] shrink-0 justify-center">
            <Link
              href={CENTRE_HREF}
              aria-label="Activity log"
              aria-current={isActive(CENTRE_HREF) ? "page" : undefined}
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
            </Link>
          </div>

          {TABS.slice(2).map(renderTab)}
        </div>
      </div>
    </nav>
  );
}
