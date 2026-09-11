import { totalumSdk } from "@/lib/totalum";
import { getCurrentUser, ok, fail } from "@/lib/learnearn-server";
import { WITHDRAWAL_CODE_TTL_MS } from "@/lib/learnearn-config";

/** Unambiguous alphabet — no O/0 or I/1 to mistype. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Builds a 16-character code, grouped as XXXX-XXXX-XXXX-XXXX for readability. */
function buildCode(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const raw = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return raw.replace(/(.{4})(?=.)/g, "$1-");
}

/** Hides most of an address for the "sent to" confirmation line. */
function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const head = name.slice(0, 2);
  return `${head}${"•".repeat(Math.max(3, name.length - 2))}@${domain}`;
}

/**
 * Issues a free one-time code to the account holder's registered email so they
 * can authorise a withdrawal. LearnEarn never sells or charges for this code.
 */
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);
    if (!user.email) return fail("Your account has no email address on file", 400);

    const code = buildCode();
    const expiresAt = new Date(Date.now() + WITHDRAWAL_CODE_TTL_MS).toISOString();

    await totalumSdk.crud.editRecordById("user", user._id, {
      withdrawal_code: code,
      withdrawal_code_expires_at: expiresAt,
    });

    const minutes = Math.round(WITHDRAWAL_CODE_TTL_MS / 60000);

    await totalumSdk.email.sendEmail({
      to: [user.email],
      subject: "Your LearnEarn withdrawal authorisation code",
      html: `
        <h2>Authorise your withdrawal</h2>
        <p>Hi ${user.name || "there"}, use this code to confirm the withdrawal you just requested:</p>
        <p style="font-size:24px;letter-spacing:3px;font-weight:700;margin:18px 0;">${code}</p>
        <p>It expires in ${minutes} minutes and can only be used once.</p>
        <p>This code is free. LearnEarn will never ask you to pay for a code, a fee
        or a "licence" to release your own money. If someone asked you to, do not
        pay them and contact our support team.</p>
        <p>If you did not request a withdrawal, ignore this email and change your password.</p>
      `,
    });

    console.log("[api/wallet/verification-code] code issued to", user._id);
    return ok({ sentTo: maskEmail(user.email), expiresInMinutes: minutes });
  } catch (err: any) {
    console.error("[api/wallet/verification-code] failed:", err);
    return fail(err?.message || "Could not send your verification code", 500);
  }
}
