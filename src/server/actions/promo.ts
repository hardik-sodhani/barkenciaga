"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { ensureDbReady } from "@/db/bootstrap";
import { getCart } from "@/lib/cart";
import {
  normalizePromoCode,
  promoFailureMessage,
  validatePromoCode,
} from "@/lib/promos";
import { getRawSession, getSession, requireAdmin } from "@/lib/session";

function revalidatePromoPaths() {
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/admin");
}

export type ApplyPromoState = {
  ok: boolean;
  message?: string;
};

export async function applyPromoAction(
  _prev: ApplyPromoState | undefined,
  formData: FormData,
): Promise<ApplyPromoState> {
  await ensureDbReady();
  const code = String(formData.get("code") ?? "");
  if (!normalizePromoCode(code)) {
    return { ok: false, message: "Enter a promo code." };
  }

  const cart = await getCart();
  if (cart.lines.length === 0) {
    return { ok: false, message: "Your bag is empty." };
  }

  const session = await getSession();
  const result = await validatePromoCode({
    code,
    userId: session.userId,
    // Validate against pre-discount subtotal (stacking is out of scope).
    subtotalCents: cart.subtotalCents,
  });

  if (!result.ok) {
    return { ok: false, message: promoFailureMessage(result.reason) };
  }

  const raw = await getRawSession();
  raw.promoCodeId = result.promo.id;
  await raw.save();
  revalidatePromoPaths();
  return { ok: true, message: `Applied ${result.promo.code}.` };
}

export async function removePromoAction() {
  await ensureDbReady();
  const raw = await getRawSession();
  delete raw.promoCodeId;
  await raw.save();
  revalidatePromoPaths();
}

const createPromoSchema = z.object({
  code: z.string().min(2).max(40),
  kind: z.enum(["percent", "fixed"]),
  valueInt: z.coerce.number().int().positive(),
  minSubtotalCents: z.coerce.number().int().min(0).default(0),
  maxRedemptions: z.string().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
});

export async function createPromoAction(formData: FormData) {
  await requireAdmin();
  await ensureDbReady();

  const parsed = createPromoSchema.parse({
    code: formData.get("code"),
    kind: formData.get("kind"),
    valueInt: formData.get("valueInt"),
    minSubtotalCents: formData.get("minSubtotalCents") || 0,
    maxRedemptions: String(formData.get("maxRedemptions") ?? ""),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
  });

  if (parsed.kind === "percent" && parsed.valueInt > 100) {
    throw new Error("Percent value must be between 1 and 100");
  }

  const maxRaw = parsed.maxRedemptions?.trim() ?? "";
  const maxRedemptions = maxRaw === "" ? null : Number.parseInt(maxRaw, 10);
  if (maxRedemptions !== null && (!Number.isFinite(maxRedemptions) || maxRedemptions < 1)) {
    throw new Error("Max redemptions must be a positive integer");
  }

  await db.insert(promoCodes).values({
    id: `promo_${nanoid(10)}`,
    code: normalizePromoCode(parsed.code),
    kind: parsed.kind,
    valueInt: parsed.valueInt,
    minSubtotalCents: parsed.minSubtotalCents,
    maxRedemptions,
    redemptionsCount: 0,
    startsAt: new Date(parsed.startsAt),
    endsAt: parsed.endsAt ? new Date(parsed.endsAt) : null,
    active: true,
  });

  revalidatePath("/admin");
}

export async function deactivatePromoAction(formData: FormData) {
  await requireAdmin();
  await ensureDbReady();
  const id = z.string().min(1).parse(formData.get("id"));
  await db.update(promoCodes).set({ active: false }).where(eq(promoCodes.id, id));
  revalidatePath("/admin");
}
