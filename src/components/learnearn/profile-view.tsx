"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Headset,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Ticket,
  Wallet,
} from "lucide-react";
import { files } from "@assets/files";
import { signOut } from "@/lib/auth-client";
import { formatNaira } from "@/lib/learnearn-config";
import { PageHeader } from "./page-header";
import { useAppState } from "./app-state";

const LINKS = [
  { href: "/wallet", label: "Wallet & payouts", icon: Wallet },
  { href: "/upgrade", label: "Membership tier", icon: Crown },
  { href: "/buy-naira-code", label: "Redeem a Naira Code", icon: Ticket },
  { href: "/support", label: "Help & support", icon: Headset },
];

/** Account screen: identity, stats, settings links and sign out. */
export function ProfileView() {
  const { profile, loading } = useAppState();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      console.log("[ProfileView] signed out");
      window.location.href = "/login";
    } catch (err) {
      console.error("[ProfileView] sign out failed:", err);
      setSigningOut(false);
    }
  };

  return (
    <div className="pb-4">
      <PageHeader title="Profile" subtitle="Your account, tier and preferences." />

      <div className="le-rise le-glass le-grain relative mt-5 overflow-hidden rounded-[26px] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-8 h-44 w-44 rounded-full bg-[#7C3AED] opacity-40 blur-[60px]"
        />

        <div className="relative flex items-center gap-4">
          <span className="relative shrink-0">
            <img
              src={files.userAvatarLarge}
              alt=""
              className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/15"
            />
            <span className="absolute -right-1 -bottom-1 grid h-6 w-6 place-items-center rounded-full border-2 border-[#0B0B0F] bg-gradient-to-br from-[#A78BFA] to-[#6D28D9]">
              <BadgeCheck className="h-3 w-3 text-white" strokeWidth={2.6} />
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[18px] font-bold tracking-[-0.02em] text-white">
              {loading ? "Loading…" : profile?.name || "LearnEarn member"}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12px] text-white/45">
              <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              <span className="truncate">{profile?.email || "—"}</span>
            </p>
            {profile?.phone && (
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12px] text-white/45">
                <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span className="truncate">{profile.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "Level", value: loading ? "—" : `L${profile?.level ?? 1}` },
            { label: "Tier", value: profile?.tierName || "Beginner" },
            {
              label: "Balance",
              value: loading ? "₦—" : formatNaira(profile?.balance ?? 0, false),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-center"
            >
              <p className="text-[9.5px] font-semibold tracking-[0.1em] text-white/40 uppercase">
                {stat.label}
              </p>
              <p className="le-tnum mt-1 truncate font-display text-[13px] font-extrabold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {profile?.referralCode && (
        <div className="le-rise mt-4 flex items-center gap-3 rounded-2xl border border-[#22D3EE]/22 bg-[#22D3EE]/[0.07] p-4" style={{ animationDelay: "90ms" }}>
          <Sparkles className="h-4 w-4 shrink-0 text-[#22D3EE]" strokeWidth={2.1} />
          <p className="text-[11.5px] text-white/60">
            Joined with referral code{" "}
            <span className="font-bold text-[#67E8F9]">{profile.referralCode}</span>
          </p>
        </div>
      )}

      <section className="le-rise mt-5" style={{ animationDelay: "140ms" }}>
        <h2 className="mb-3 font-display text-[15px] font-bold text-white">Account</h2>
        <div className="flex flex-col gap-2.5">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group le-panel flex items-center gap-3.5 rounded-2xl p-3.5 transition-all duration-300 hover:bg-white/[0.07]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.05] text-white/70 transition-colors duration-300 group-hover:text-[#C4B5FD]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="flex-1 font-display text-[13.5px] font-semibold text-white">
                {label}
              </span>
              <ArrowRight className="h-4 w-4 text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          ))}
        </div>
      </section>

      <div className="le-rise mt-5 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4" style={{ animationDelay: "200ms" }}>
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4ADE80]" strokeWidth={2.1} />
        <p className="text-[11.5px] leading-relaxed text-white/50">
          Your account is protected. Never share your password or one-time codes
          with anyone, including people claiming to be LearnEarn staff.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="le-rise mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#F87171]/25 bg-[#F87171]/[0.08] py-3.5 font-display text-[13.5px] font-bold text-[#FCA5A5] transition-all duration-300 hover:bg-[#F87171]/[0.14] active:scale-[0.98] disabled:opacity-60"
        style={{ animationDelay: "260ms" }}
      >
        <LogOut className="h-4 w-4" strokeWidth={2.2} />
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
