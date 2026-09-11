"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAppState } from "./app-state";

/** Returns the time-of-day greeting for the device's current local hour. */
function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** Greeting line + level pill + inline upgrade link. */
export function WelcomeHeader() {
  const { profile } = useAppState();

  // Read on mount (client-side) so this reflects the visitor's own device
  // clock/timezone, not any server-rendered time; refreshed every minute so
  // it flips morning -> afternoon -> evening live without a page reload.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Only the first name keeps the greeting on one line.
  const firstName = (profile?.name || "there").split(" ")[0];
  const level = profile?.level ?? 1;
  const tier = profile?.tierName || "Beginner";

  return (
    <section className="le-rise pt-5" style={{ animationDelay: "60ms" }}>
      <h1 className="font-display text-[22px] font-bold leading-tight tracking-[-0.02em] text-white">
        {now ? greetingFor(now) : "Hello"}, {firstName}{" "}
        <span className="inline-block origin-[70%_70%] animate-[le-float_3.5s_ease-in-out_infinite]">
          👋
        </span>
      </h1>

      <div className="mt-3 flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8B5CF6]/28 bg-white/[0.045] py-1.5 pr-3.5 pl-1.5 backdrop-blur-sm">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[#FDE68A] to-[#F5B301] shadow-[0_0_10px_-1px_rgba(245,179,1,0.8)]">
            <Star className="h-3 w-3 fill-[#7C4A03] text-[#7C4A03]" strokeWidth={2.5} />
          </span>
          <span className="text-[11.5px] font-semibold tracking-[0.01em] text-white/80">
            Level {level} <span className="text-white/30">•</span> {tier}
          </span>
        </span>

        <Link
          href="/upgrade"
          className="group relative text-[11.5px] font-bold tracking-wide text-[#A78BFA] uppercase transition-colors duration-300 hover:text-[#C4B5FD]"
        >
          Upgrade
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#C4B5FD] transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>
    </section>
  );
}
