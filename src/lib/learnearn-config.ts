/**
 * Shared LearnEarn constants. Safe to import from both client and server.
 */

/** Official bank account users transfer to when funding or upgrading. */
export const BANK_DETAILS = {
  accountName: "Chika Onyeabor",
  accountNumber: "9018312737",
  bankName: "Moniepoint MFB",
} as const;

/** Shown verbatim on the payment page. */
export const PAYMENT_INSTRUCTION =
  "To fund your account or complete your upgrade, make a direct bank transfer to the official account below. Please do not use OPay Bank for this transfer. Upload your receipt once completed.";

/** Welcome balance credited to every new account. */
export const WELCOME_BALANCE = 96000;

/** One-off welcome bonus offered on the dashboard rewards banner. */
export const WELCOME_REWARD = 96000;

/** Formats a Naira amount, e.g. 96000 -> "₦96,000.00" */
export function formatNaira(value: number, withDecimals = true): string {
  const n = Number.isFinite(value) ? value : 0;
  return `₦${n.toLocaleString("en-NG", {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  })}`;
}

/** Compact Naira for tight spaces, e.g. 96000 -> "₦96,000" */
export function formatNairaShort(value: number): string {
  return formatNaira(value, false);
}

/** Daily reward offered on the dashboard banner. */
export const DAILY_REWARD = 96000;

/** A claimed reward locks the banner for 24 hours. */
export const CLAIM_INTERVAL_MS = 24 * 60 * 60 * 1000;

/** How long the celebration overlay keeps raining confetti. */
export const CELEBRATION_DURATION_MS = 60 * 1000;

/** Banks a user can send a payout to. */
export const NIGERIAN_BANKS = [
  "Moniepoint MFB",
  "OPay",
  "GTBank",
  "Zenith Bank",
  "Access Bank",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Union Bank",
  "Fidelity Bank",
  "Sterling Bank",
  "Stanbic IBTC",
  "Wema Bank",
  "Polaris Bank",
  "Kuda Microfinance Bank",
  "PalmPay",
  "Ecobank Nigeria",
  "Keystone Bank",
  "FCMB",
  "Providus Bank",
  "Jaiz Bank",
] as const;

/** Official community and support destinations. */
export const SUPPORT_LINKS = {
  telegram: "https://t.me/DailyRewards_NG",
  whatsappChannel: "https://whatsapp.com/channel/0029Vb7bp5aJ93wYRk9FUY0t",
  liveAgentNumber: "+1 (347) 434-9850",
  liveAgent: "https://wa.me/13474349850",
} as const;

/** Formats a remaining duration as "23:59:59". Clamps at zero. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Splits an ISO timestamp into the date / time pair used by the history rows. */
export function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "—", time: "—" };
  return {
    date: d.toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}
