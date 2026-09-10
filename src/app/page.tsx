"use client";

import { useState } from "react";
import { AmbientGlow } from "@/components/learnearn/ambient-glow";
import { TopNav } from "@/components/learnearn/top-nav";
import { WelcomeHeader } from "@/components/learnearn/welcome-header";
import { WalletCard } from "@/components/learnearn/wallet-card";
import { RewardsBanner } from "@/components/learnearn/rewards-banner";
import { QuickAccess } from "@/components/learnearn/quick-access";
import { BottomNav, type TabKey } from "@/components/learnearn/bottom-nav";
import {
  ActivityPanel,
  EarnPanel,
  ProfilePanel,
  WalletPanel,
} from "@/components/learnearn/tab-panels";

/**
 * LearnEarn — entry screen.
 * Mobile-first fintech dashboard rendered inside a centred phone-width column.
 */
export default function Main() {
  const [tab, setTab] = useState<TabKey>("home");

  const handleTabChange = (next: TabKey) => {
    console.log("[LearnEarn] switching tab:", tab, "->", next);
    setTab(next);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0F] text-white">
      <AmbientGlow />

      {/* Phone-width column, centred on larger screens */}
      <div className="relative z-10 mx-auto w-full max-w-md px-5 pb-32">
        <TopNav unread={1} />

        {/* `key` restarts the entry animations whenever the tab changes */}
        <div key={tab}>
          {tab === "home" && (
            <>
              <WelcomeHeader name="Jame" />
              <WalletCard />
              <RewardsBanner amount="₦96,000" />
              <QuickAccess />
            </>
          )}
          {tab === "earn" && <EarnPanel />}
          {tab === "activity" && <ActivityPanel />}
          {tab === "wallet" && <WalletPanel />}
          {tab === "profile" && <ProfilePanel />}
        </div>
      </div>

      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  );
}
