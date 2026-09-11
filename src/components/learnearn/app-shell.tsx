"use client";

import { AmbientGlow } from "./ambient-glow";
import { BottomNav } from "./bottom-nav";
import { TopNav } from "./top-nav";

/**
 * Shared chrome for every signed-in screen: ambient background, sticky top
 * bar, phone-width column and the floating bottom navigation.
 *
 * Wallet state itself lives in <AppStateProvider>, mounted once in the root
 * layout — not here — so it survives navigation between screens instead of
 * being re-created (and re-fetched) every time a page mounts its own shell.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0B0B0F] text-white">
      <AmbientGlow />

      <div className="relative z-10 mx-auto w-full max-w-md px-5 pb-32">
        <TopNav />
        {children}
      </div>

      <BottomNav />
    </div>
  );
}
