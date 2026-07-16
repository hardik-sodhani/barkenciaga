"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { getCart } from "@/lib/cart";
import {
  normalizePromoCode,
  validatePromo,
} from "@/lib/promos";
import { getSession, requireAdmin, setSessionPromoCodeId } from "@/lib/session";
import { ensureDbReady } from "@/db/bootstrap";

export type PromoActionState = {
  ok: boolean;
  message: string;
};

export async function applyPromoAction(
  _prev: PromoActionState | null,
  formData: FormData,
): Promise<PromoActionState> {
  await ensureDbReady();
  const code = String(formData.get("code") ?? "");
  if (!code.trim()) {
    return { ok: false, message: "Enter a promo code." };
  }

  const cart = await getCart();
  if (cart.lines.length === 0) {
    return { ok: false, message: "Add something to your bag before applying a promo." };
  }

  const session = await getSession();
  const result = await validatePromo({
    code,
    userId: session.userId,
    subtotalCents: cart.subtotalCents,
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  await setSessionPromoCodeId(result.promo.id);
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return {
    ok: true,
    message: `Applied ${result.promo.code} — ${formatDiscountLabel(result.discountCents)} off.`,
  };
}

export async function removePromoAction() {
  await setSessionPromoCodeId(null);
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

const createPromoSchema = z.object({
  code: z.string().min(2).max(40),
  kind: z.enum(["percent", "fixed"]),
  valueInt: z.coerce.number().int().positive(),
  minSubtotalCents: z.coerce.number().int().min(0).default(0),
  maxRedemptions: z
    .union([z.coerce.number().int().positive(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" || v == null ? null : v)),
  startsAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : null)),
  endsAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : null)),
});

export async function createPromoAction(formData: FormData) {
  await requireAdmin();
  await ensureDbReady();
  const parsed = createPromoSchema.parse({
    code: formData.get("code"),
    kind: formData.get("kind"),
    valueInt: formData.get("valueInt"),
    minSubtotalCents: formData.get("minSubtotalCents") || 0,
    maxRedemptions: formData.get("maxRedemptions"),
    startsAt: formData.get("startsAt") || undefined,
    endsAt: formData.get("endsAt") || undefined,
  });

  if (parsed.kind === "percent" && parsed.valueInt > 100) {
    throw new Error("Percent promos must be 1–100.");
  }

  await db.insert(promoCodes).values({
    id: `promo_${nanoid(10)}`,
    code: normalizePromoCode(parsed.code),
    kind: parsed.kind,
    valueInt: parsed.valueInt,
    minSubtotalCents: parsed.minSubtotalCents,
    maxRedemptions: parsed.maxRedemptions,
    startsAt: parsed.startsAt,
    endsAt: parsed.endsAt,
    active: true,
  });

  revalidatePath("/admin");
}

export async function deactivatePromoAction(formData: FormData) {
  await requireAdmin();
  await ensureDbReady();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing promo id");
  await db.update(promoCodes).set({ active: false }).where(eq(promoCodes.id, id));
  revalidatePath("/admin");
}

function formatDiscountLabel(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
