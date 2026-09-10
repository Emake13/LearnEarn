"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "@/lib/api";
import type { MeProfile } from "@/types/learnearn";

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
}

const Ctx = createContext<AppState | null>(null);

/**
 * Holds the signed-in user's wallet state so it stays consistent as the
 * user moves between routes. Mounted once in the app shell.
 */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<MeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceHidden, setBalanceHidden] = useState(false);

  const refresh = useCallback(async () => {
    const res = await api.get<MeProfile>("/api/me");
    if (res.ok && res.data) {
      setProfileState(res.data);
    } else {
      console.error("[AppState] could not load profile:", res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
    }),
    [profile, loading, refresh, balanceHidden]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}
