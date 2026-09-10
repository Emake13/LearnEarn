"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Banknote,
  ChevronRight,
  Flame,
  PlayCircle,
  ShieldCheck,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { files } from "@assets/files";

/* ---------- shared shells ---------- */

function PanelHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="le-rise pt-6">
      <h1 className="font-display text-[22px] font-bold tracking-[-0.02em] text-white">
        {title}
      </h1>
      <p className="mt-1 text-[12.5px] text-white/45">{sub}</p>
    </div>
  );
}

function Row({
  icon: Icon,
  title,
  sub,
  trailing,
  tint = "text-[#A78BFA]",
  ring = "border-[#8B5CF6]/30 bg-[#8B5CF6]/12",
  delay = 0,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  trailing?: React.ReactNode;
  tint?: string;
  ring?: string;
  delay?: number;
}) {
  return (
    <div
      className="le-rise le-panel flex items-center gap-3.5 rounded-2xl p-3.5 transition-colors duration-300 hover:bg-white/[0.06]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${ring}`}>
        <Icon className={`h-[18px] w-[18px] ${tint}`} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[13.5px] font-semibold text-white">
          {title}
        </p>
        <p className="truncate text-[11.5px] text-white/45">{sub}</p>
      </div>
      {trailing}
    </div>
  );
}

/* ---------- Earn ---------- */

const COURSES = [
  { title: "Intro to Digital Payments", lessons: "4 of 6 lessons", progress: 66, reward: "₦4,500" },
  { title: "Smart Saving Habits", lessons: "2 of 8 lessons", progress: 25, reward: "₦6,000" },
  { title: "Crypto Basics 101", lessons: "Not started", progress: 0, reward: "₦9,000" },
];

export function EarnPanel() {
  return (
    <div className="pb-4">
      <PanelHeading title="Earn" sub="Finish a lesson, unlock a payout." />

      <div className="mt-5 flex flex-col gap-3">
        {COURSES.map((c, i) => (
          <div
            key={c.title}
            className="le-rise le-panel le-grain relative overflow-hidden rounded-[22px] p-4"
            style={{ animationDelay: `${80 + i * 80}ms` }}
          >
            <div className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#6D28D9] shadow-[0_10px_24px_-12px_rgba(139,92,246,1)]">
                <PlayCircle className="h-5 w-5 text-white" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[14px] font-bold tracking-[-0.01em] text-white">
                  {c.title}
                </p>
                <p className="mt-0.5 text-[11.5px] text-white/45">{c.lessons}</p>
              </div>
              <span className="le-tnum shrink-0 rounded-full border border-[#F5B301]/30 bg-[#F5B301]/12 px-2.5 py-1 text-[11px] font-bold text-[#FCD34D]">
                {c.reward}
              </span>
            </div>

            <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#22D3EE] transition-all duration-700"
                style={{ width: `${c.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Activity ---------- */

const ACTIVITY = [
  { icon: ArrowDownLeft, title: "Lesson reward", sub: "Today • 14:22", amount: "+₦4,500", positive: true },
  { icon: ArrowUpRight, title: "Withdrawal to GTBank", sub: "Yesterday • 09:05", amount: "−₦12,000", positive: false },
  { icon: Award, title: "Streak bonus", sub: "Mon • 18:40", amount: "+₦1,200", positive: true },
  { icon: Banknote, title: "Naira code purchase", sub: "Sun • 11:12", amount: "−₦2,500", positive: false },
];

export function ActivityPanel() {
  return (
    <div className="pb-4">
      <PanelHeading title="Activity" sub="Every naira in and out, in one log." />
      <div className="mt-5 flex flex-col gap-2.5">
        {ACTIVITY.map((a, i) => (
          <Row
            key={a.title}
            icon={a.icon}
            title={a.title}
            sub={a.sub}
            delay={80 + i * 70}
            tint={a.positive ? "text-[#4ADE80]" : "text-[#F87171]"}
            ring={
              a.positive
                ? "border-[#4ADE80]/25 bg-[#4ADE80]/10"
                : "border-[#F87171]/25 bg-[#F87171]/10"
            }
            trailing={
              <span
                className={`le-tnum shrink-0 font-display text-[13px] font-bold ${
                  a.positive ? "text-[#4ADE80]" : "text-white/70"
                }`}
              >
                {a.amount}
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Wallet ---------- */

export function WalletPanel() {
  return (
    <div className="pb-4">
      <PanelHeading title="Wallet" sub="Balances, payout methods and limits." />

      <div
        className="le-rise le-glass le-grain relative mt-5 overflow-hidden rounded-[24px] p-5"
        style={{ animationDelay: "80ms" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-8 h-40 w-40 rounded-full bg-[#7C3AED] opacity-40 blur-[60px]"
        />
        <p className="relative text-[12px] font-medium text-white/55">Available to withdraw</p>
        <p className="le-tnum relative mt-1.5 font-display text-[30px] leading-none font-extrabold tracking-[-0.03em] text-white">
          ₦96,000.00
        </p>
        <div className="relative mt-4 flex gap-2.5">
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold text-white/65">
            Daily limit ₦200,000
          </span>
          <span className="rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/10 px-3 py-1.5 text-[11px] font-semibold text-[#4ADE80]">
            Verified
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <Row icon={Banknote} title="GTBank •••• 4471" sub="Default payout account" delay={160} trailing={<BadgeCheck className="h-4 w-4 shrink-0 text-[#4ADE80]" />} />
        <Row icon={ShieldCheck} title="Transaction PIN" sub="Last changed 12 days ago" delay={230} trailing={<ChevronRight className="h-4 w-4 shrink-0 text-white/30" />} />
      </div>
    </div>
  );
}

/* ---------- Profile ---------- */

const STATS = [
  { label: "Lessons", value: "18" },
  { label: "Streak", value: "6d" },
  { label: "Earned", value: "₦96k" },
];

export function ProfilePanel() {
  return (
    <div className="pb-4">
      <div className="le-rise le-glass le-grain relative mt-6 overflow-hidden rounded-[24px] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-14 left-1/3 h-44 w-44 rounded-full bg-[#8B5CF6] opacity-35 blur-[60px]"
        />
        <div className="relative flex items-center gap-4">
          <span className="relative h-16 w-16 shrink-0 rounded-full p-[2px]">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A78BFA] via-[#8B5CF6] to-[#22D3EE]" />
            <img
              src={files.userAvatarLarge}
              alt="Jame's profile"
              className="relative h-full w-full rounded-full border-2 border-[#0B0B0F] object-cover"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[18px] font-bold tracking-[-0.02em] text-white">
              Jame Adeyemi
            </p>
            <p className="mt-0.5 truncate text-[12px] text-white/45">jame@learnearn.ng</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/12 px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-[#C4B5FD] uppercase">
              <Flame className="h-3 w-3" strokeWidth={2.5} /> Level 1 • Beginner
            </span>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2.5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.035] py-3 text-center"
            >
              <p className="le-tnum font-display text-[16px] font-extrabold text-white">
                {s.value}
              </p>
              <p className="mt-0.5 text-[10.5px] font-medium text-white/45">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <Row icon={Target} title="Goals & milestones" sub="2 active goals" delay={120} trailing={<ChevronRight className="h-4 w-4 shrink-0 text-white/30" />} />
        <Row icon={ShieldCheck} title="Security" sub="2FA enabled" delay={190} trailing={<ChevronRight className="h-4 w-4 shrink-0 text-white/30" />} />
        <Row icon={Award} title="Achievements" sub="5 badges unlocked" delay={260} trailing={<ChevronRight className="h-4 w-4 shrink-0 text-white/30" />} />
      </div>
    </div>
  );
}
