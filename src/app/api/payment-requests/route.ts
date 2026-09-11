import { totalumSdk } from "@/lib/totalum";
import { getCurrentUser, ok, fail } from "@/lib/learnearn-server";

/** Lists this user's funding / upgrade requests, newest first. */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const result = await totalumSdk.crud.query("payment_request", {
      _filter: { user: user._id },
      _sort: { createdAt: "desc" },
      _limit: 20,
    });

    return ok(result.data ?? []);
  } catch (err: any) {
    console.error("[api/payment-requests GET] failed:", err);
    return fail(err?.message || "Could not load your requests", 500);
  }
}

/**
 * Submits a bank-transfer receipt for verification.
 * Expects multipart/form-data so the receipt image can be uploaded.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const form = await request.formData();
    const receipt = form.get("receipt");
    const amount = Number(form.get("amount"));
    const purpose = String(form.get("purpose") || "fund_account");
    const senderName = String(form.get("senderName") || "").trim();
    const targetTier = String(form.get("targetTier") || "").trim();
    const note = String(form.get("note") || "").trim();

    if (!(receipt instanceof File) || receipt.size === 0) {
      return fail("Attach a photo of your payment receipt");
    }
    if (!amount || amount <= 0) return fail("Enter the amount you transferred");
    if (!senderName) return fail("Enter the account name you transferred from");

    // Push the receipt into Totalum storage first, then link it by file id.
    const uploadForm = new FormData();
    uploadForm.append("file", receipt, receipt.name || "receipt.jpg");

    const uploadResult = await totalumSdk.files.uploadFile(uploadForm);
    if (uploadResult.errors) {
      console.error("[api/payment-requests] upload errors:", uploadResult.errors);
    }
    const fileNameId = uploadResult.data as unknown as string;
    if (!fileNameId) return fail("The receipt could not be uploaded. Try again.", 502);

    const reference = `LE-${Date.now().toString(36).toUpperCase()}`;

    const payload: Record<string, unknown> = {
      user: user._id,
      reference,
      purpose: purpose === "upgrade" ? "upgrade" : "fund_account",
      amount,
      sender_name: senderName,
      receipt: { name: fileNameId },
      status: "pending",
    };
    if (targetTier) payload.target_tier = targetTier;
    if (note) payload.note = note;

    const created = await totalumSdk.crud.createRecord("payment_request", payload);

    console.log("[api/payment-requests] receipt submitted", { reference, amount, purpose });
    return ok({ reference, id: (created.data as any)?.insertedId ?? null });
  } catch (err: any) {
    console.error("[api/payment-requests POST] failed:", err);
    return fail(err?.message || "Could not submit your receipt", 500);
  }
}
