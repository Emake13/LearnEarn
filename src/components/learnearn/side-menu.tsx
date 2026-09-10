"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "@/lib/auth-client";
import { files } from "@assets/files";
import { Logo } from "./logo";
import { useAppState } from "./app-state";
import {
  ArrowUpRight,
  Gift,
  Headphones,
  KeyRound,
  LayoutGrid,
  LogOut,
  Menu,
  NotebookText,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MENU_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Earn More", href: "/earn", icon: Gift },
  { label: "Wallet & Payouts", href: "/wallet", icon: Wallet },
  { label: "Activity", href: "/activity", icon: NotebookText },
  { label: "Upgrade", href: "/upgrade", icon: TrendingUp },
  { label: "BUY Naira Code", href: "/buy-naira-code", icon: KeyRound },
  { label: "Fund / Payment", href: "/payment", icon: Receipt },
  { label: "Support", href: "/support", icon: Headphones },
];

/** Slide-out navigation drawer opened from the hamburger in the top bar. */
export function SideMenu() {
  const router = useRouter();
  const { profile } = useAppState();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    console.log("[SideMenu] signing out");
    try {
      await signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error("[SideMenu] sign out failed:", err);
      setSigningOut(false);
    }
  };

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="group grid h-10 w-10 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-300 hover:border-[#8B5CF6]/45 hover:bg-white/[0.07] active:scale-90"
        >
          <Menu
            className="h-[18px] w-[18px] text-white/75 transition-colors duration-300 group-hover:text-white"
            strokeWidth={2.2}
          />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        aria-describedby={undefined}
        className="w-[82%] max-w-[19rem] border-r border-white/[0.07] bg-[#0B0B0F] p-0 text-white [&>button]:top-6 [&>button]:right-5 [&>button]:text-white/60"
      >
        <SheetTitle className="sr-only">LearnEarn navigation</SheetTitle>

        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-[#7C3AED] opacity-25 blur-[90px]"
        />

        <div className="le-no-scrollbar relative flex h-full flex-col overflow-y-auto">
          <div className="px-6 pt-6 pb-5">
            <Logo />
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="le-panel mx-5 flex items-center gap-3 rounded-2xl p-3.5 transition-colors duration-300 hover:bg-white/[0.07]"
          >
            <img
              src={files.userAvatarLarge}
              alt=""
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#8B5CF6]/50"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-semibold text-white">
                {profile?.name || "Your account"}
              </p>
              <p className="truncate text-[11px] font-medium text-white/45">
                Level {profile?.level ?? 1} • {profile?.tierName || "Beginner"}
              </p>
            </div>
          </Link>

          <nav className="mt-5 flex flex-col gap-1 px-4">
            {MENU_ITEMS.map(({ label, href, icon: Icon }) => (
              <button
                key={href}
                type="button"
                onClick={() => go(href)}
                className="group flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-left transition-all duration-300 hover:bg-white/[0.06] active:scale-[0.98]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/55 transition-colors duration-300 group-hover:text-white">
                  <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                </span>
                <span className="text-[14px] font-semibold text-white/70 group-hover:text-white">
                  {label}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="group mt-1 flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-left transition-all duration-300 hover:bg-[#F87171]/10 active:scale-[0.98] disabled:opacity-60"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#F87171]/25 bg-[#F87171]/10 text-[#F87171]">
                <LogOut className="h-[17px] w-[17px]" strokeWidth={2} />
              </span>
              <span className="text-[14px] font-semibold text-[#F87171]">
                {signingOut ? "Signing out…" : "Sign out"}
              </span>
            </button>
          </nav>

          <div className="mt-auto p-5">
            <Link
              href="/upgrade"
              onClick={() => setOpen(false)}
              className="relative block overflow-hidden rounded-2xl border border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6]/22 to-[#4F46E5]/10 p-4 transition-transform duration-300 hover:scale-[1.02]"
            >
              <p className="font-display text-[14px] font-bold text-white">Go Premium</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-white/55">
                Unlock higher payout limits and instant withdrawals.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#C4B5FD]">
                Upgrade now <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
