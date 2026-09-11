import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/learnearn/app-shell";
import { Landing } from "@/components/learnearn/landing";
import { WelcomeHeader } from "@/components/learnearn/welcome-header";
import { WalletCard } from "@/components/learnearn/wallet-card";
import { RewardsBanner } from "@/components/learnearn/rewards-banner";
import { QuickAccess } from "@/components/learnearn/quick-access";
import { PromoGrid } from "@/components/learnearn/promo-grid";
import { TransactionHistory } from "@/components/learnearn/transaction-history";

/**
 * LearnEarn entry point.
 * Signed out -> marketing landing with register / login.
 * Signed in  -> the main wallet dashboard.
 */
export default async function Main() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    console.log("[page] no session, showing landing");
    return <Landing />;
  }

  return (
    <AppShell>
      <WelcomeHeader />
      <WalletCard />
      <RewardsBanner />
      <QuickAccess />
      <PromoGrid />
      <TransactionHistory />
    </AppShell>
  );
}
