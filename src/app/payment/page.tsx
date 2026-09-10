import { Suspense } from "react";
import { AppShell } from "@/components/learnearn/app-shell";
import { PaymentView } from "@/components/learnearn/payment-view";

export default function PaymentPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="pt-16 text-center text-[13px] text-white/45">Loading…</div>
        }
      >
        <PaymentView />
      </Suspense>
    </AppShell>
  );
}
