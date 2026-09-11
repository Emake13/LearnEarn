"use client";

import { signOut } from "@/lib/auth-client";

/**
 * Wipes every trace of the current account from the browser.
 *
 * React state alone is not enough: a hard navigation is what guarantees the
 * in-memory stores, the Next.js router cache and any cached RSC payloads are
 * all discarded, so the next account to sign in on this device starts clean.
 */
export function clearClientState(): void {
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch (err) {
    // Storage can be unavailable in private mode — not fatal, keep going.
    console.error("[session-reset] could not clear web storage:", err);
  }
}

/**
 * Signs the user out, clears local state and hard-navigates to `to`.
 * Always lands on the destination, even if the sign-out call itself fails,
 * so a user can never be left on a dashboard holding stale data.
 */
export async function signOutAndReset(to = "/login"): Promise<void> {
  console.log("[session-reset] signing out and resetting local state");
  try {
    await signOut();
  } catch (err) {
    console.error("[session-reset] sign out request failed:", err);
  } finally {
    clearClientState();
    // Hard navigation — replaces history so Back cannot restore the old view.
    window.location.replace(to);
  }
}
