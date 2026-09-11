/** Shared LearnEarn domain types mirroring the Totalum schema. */

export interface TotalumFile {
  name: string;
  url?: string;
}

export interface UpgradeTier {
  _id: string;
  name: string;
  level: number;
  tagline?: string;
  price: number;
  daily_earning_limit: number;
  withdrawal_speed?: string;
  /** One benefit per line. */
  benefits?: string;
  accent_color?: string;
  status?: "active" | "inactive";
}

export interface EarnTask {
  _id: string;
  title: string;
  description?: string;
  task_type: "quiz" | "survey" | "sponsored" | "lesson";
  duration_minutes: number;
  reward_amount: number;
  status?: "active" | "inactive";
  sort_order?: number;
}

export interface WalletTransaction {
  _id: string;
  title: string;
  transaction_type: "reward" | "task_earning" | "naira_code" | "withdrawal" | "upgrade";
  amount: number;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  /** Public reference, currently only written for withdrawal requests. */
  reference?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
}

export interface PaymentRequest {
  _id: string;
  reference: string;
  purpose: "fund_account" | "upgrade";
  amount: number;
  sender_name?: string;
  status: "pending" | "approved" | "rejected";
  receipt?: TotalumFile;
  createdAt: string;
}

/** Everything the dashboard needs about the signed-in user. */
export interface MeProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  referralCode?: string;
  level: number;
  balance: number;
  availableBalance: number;
  rewardClaimed: boolean;
  tierName: string;
  /** ISO timestamp when the daily reward unlocks again, null when claimable now. */
  nextClaimAt: string | null;
  canClaim: boolean;
}

/** Receipt returned after a withdrawal request is filed for review. */
export interface WithdrawalReceipt {
  reference: string;
  amount: number;
  accountName: string;
  accountNumber: string;
  bankName: string;
  status: "pending";
  createdAt: string;
}
