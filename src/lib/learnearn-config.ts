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
