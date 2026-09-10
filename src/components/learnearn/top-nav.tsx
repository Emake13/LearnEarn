"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { files } from "@assets/files";
import { Logo } from "./logo";
import { SideMenu } from "./side-menu";

/**
 * Sticky, blurred top bar: hamburger • centered logotype • notifications + avatar.
 */
export function TopNav({ unread = 1 }: { unread?: number }) {
  return (
    <header className="sticky top-0 z-40 -mx-5 mb-1 border-b border-white/[0.05] bg-[#0B0B0F]/72 px-5 backdrop-blur-2xl backdrop-saturate-150">
      <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-2">
        <SideMenu />

        <div className="flex justify-center">
          <Link href="/" aria-label="LearnEarn home">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/activity"
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
            className="group relative grid h-10 w-10 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-300 hover:border-[#8B5CF6]/45 hover:bg-white/[0.07] active:scale-90"
          >
            <Bell
              className="h-[18px] w-[18px] text-white/75 transition-all duration-300 group-hover:text-white group-hover:-rotate-12"
              strokeWidth={2}
            />
            {unread > 0 && (
              <>
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#FF3B5C] shadow-[0_0_10px_1px_rgba(255,59,92,0.85)]" />
                <span className="le-breathe absolute top-2 right-2 h-2 w-2 rounded-full bg-[#FF3B5C]" />
              </>
            )}
          </Link>

          <Link
            href="/profile"
            aria-label="Open profile"
            className="group relative h-10 w-10 shrink-0 rounded-full p-[1.5px] transition-transform duration-300 active:scale-90"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A78BFA] via-[#8B5CF6] to-[#22D3EE] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            <img
              src={files.userAvatar}
              alt="Your profile"
              className="relative h-full w-full rounded-full border-2 border-[#0B0B0F] object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
