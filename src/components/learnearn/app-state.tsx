"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import type { MeProfile } from "@/types/learnearn";

/**
 * Routes that are always signed-out, so the profile call there is guaranteed
 * to 401. Skipping it keeps the auth screens snappy — it was one more request
 * competing with sign-up on the slowest page in the app.
 */
const SIGNED_OUT_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

interface AppState {
  profile: MeProfile | null;
  loading: boolean;
  /** Re-fetches the profile from the server. */
  refresh: () => Promise<void>;
  /** Applies a profile returned by a mutation without a round-trip. */
  setProfile: (profile: MeProfile) => void;
  /** Dashboard balance visibility, shared across every screen. */
  balanceHidden: boolean;
  toggleBalance: () => void;
  /** Bumped whenever a wallet movement happens, so history lists re-fetch. */
  transactionsVersion: number;
  bumpTransactions: () => void;
}

const Ctx = createContext<AppState | null>(null);

/**
 * Holds the signed-in user's wallet state so it stays consistent as the
 * user moves between routes. Mounted once in the app shell.
 */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipProfileFetch = SIGNED_OUT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const [profile, setProfileState] = useState<MeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [transactionsVersion, setTransactionsVersion] = useState(0);

  const refresh = useCallback(async () => {
    let res = await api.get<MeProfile>("/api/me");

    // A cold serverless start right after sign-up can drop the very first
    // profile call. Retry once on a server/network failure — but never on a
    // 401, which is a genuine signed-out state, not a blip.
    if (!res.ok && res.status !== 401) {
      console.warn("[AppState] profile call failed, retrying once:", res.error);
      await new Promise((r) => setTimeout(r, 1200));
      res = await api.get<MeProfile>("/api/me");
    }

    if (res.ok && res.data) {
      setProfileState((prev) => {
        // A different account on this device gets a clean slate, never the
        // previous user's balances, counters or ledger.
        if (prev && prev.id !== res.data!.id) {
          console.log("[AppState] account changed, resetting local state");
          setBalanceHidden(false);
          setTransactionsVersion((v) => v + 1);
        }
        return res.data!;
      });
    } else {
      // No valid session (or the call failed) — drop whatever we were holding
      // rather than leaving the last user's data on screen.
      console.error("[AppState] could not load profile:", res.error);
      setProfileState(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (skipProfileFetch) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [refresh, skipProfileFetch]);

  const value = useMemo<AppState>(
    () => ({
      profile,
      loading,
      refresh,
      setProfile: (p: MeProfile) => setProfileState(p),
      balanceHidden,
      toggleBalance: () =>
        setBalanceHidden((v) => {
          console.log("[AppState] balance visibility ->", v ? "shown" : "hidden");
          return !v;
        }),
      transactionsVersion,
      bumpTransactions: () => setTransactionsVersion((v) => v + 1),
    }),
    [profile, loading, refresh, balanceHidden, transactionsVersion]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}
