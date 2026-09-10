"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { files } from "@assets/files";
import {
  ArrowUpRight,
  BookOpen,
  Gift,
  Headphones,
  LayoutGrid,
  Menu,
  Settings,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "My Courses", icon: BookOpen },
  { label: "Wallet & Payouts", icon: Wallet },
  { label: "Rewards", icon: Gift },
  { label: "Security", icon: ShieldCheck },
  { label: "Support", icon: Headphones },
  { label: "Settings", icon: Settings },
];

/**
 * Slide-out navigation drawer opened from the hamburger button in the top bar.
 */
export function SideMenu() {
  return (
    <Sheet>
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

        {/* Drawer ambience */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-[#7C3AED] opacity-25 blur-[90px]"
        />

        <div className="relative flex h-full flex-col overflow-y-auto le-no-scrollbar">
          <div className="px-6 pt-6 pb-5">
            <Logo />
          </div>

          {/* Account summary */}
          <div className="mx-5 flex items-center gap-3 rounded-2xl le-panel p-3.5">
            <img
              src={files.userAvatarLarge}
              alt="Jame's profile picture"
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#8B5CF6]/50"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-semibold text-white">
                Jame Adeyemi
              </p>
              <p className="truncate text-[11px] font-medium text-white/45">
                Level 1 • Beginner
              </p>
            </div>
          </div>

          <nav className="mt-5 flex flex-col gap-1 px-4">
            {MENU_ITEMS.map(({ label, icon: Icon }, i) => (
              <button
                key={label}
                type="button"
                className={`group flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-left transition-all duration-300 hover:bg-white/[0.06] active:scale-[0.98] ${
                  i === 0 ? "bg-white/[0.05]" : ""
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${
                    i === 0
                      ? "border-[#8B5CF6]/45 bg-[#8B5CF6]/20 text-[#C4B5FD]"
                      : "border-white/[0.07] bg-white/[0.03] text-white/55 group-hover:text-white"
                  }`}
                >
                  <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                </span>
                <span
                  className={`text-[14px] font-semibold ${
                    i === 0 ? "text-white" : "text-white/70 group-hover:text-white"
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-auto p-5">
            <div className="relative overflow-hidden rounded-2xl border border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6]/22 to-[#4F46E5]/10 p-4">
              <p className="font-display text-[14px] font-bold text-white">
                Go Premium
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-white/55">
                Unlock higher payout limits and pro courses.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#C4B5FD]">
                Upgrade now <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
