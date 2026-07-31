"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { getCart } from "@/lib/cart";
import {
  getSession,
  requireAdmin,
  setPromoCodeId,
} from "@/lib/session";
import {
  validatePromo,
  type PromoRejectionReason,
} from "@/lib/promos";

const applyPromoSchema = z.object({
  code: z.string().trim().min(1).max(40),
});

const optionalInteger = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().int().positive().optional(),
);

const optionalDate = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.date().optional(),
);

const createPromoSchema = z
  .object({
    code: z.string().trim().min(1).max(40),
    kind: z.enum(["percent", "fixed"]),
    valueInt: z.coerce.number().int().positive(),
    minSubtotalCents: z.coerce.number().int().min(0),
    maxRedemptions: optionalInteger,
    startsAt: z.coerce.date(),
    endsAt: optionalDate,
  })
  .refine(
    (promo) => promo.kind !== "percent" || promo.valueInt <= 100,
    "Percent discounts cannot exceed 100",
  )
  .refine(
    (promo) => !promo.endsAt || promo.endsAt > promo.startsAt,
    "End date must be after start date",
  );

const deactivatePromoSchema = z.object({
  id: z.string().min(1),
});

const rejectionMessages: Record<PromoRejectionReason, string> = {
  not_found: "Promo code not found",
  inactive: "This promo code is inactive",
  expired: "This promo code has expired",
  not_started: "This promo code is not active yet",
  min_subtotal: "Your bag does not meet this promo's minimum subtotal",
  max_redemptions: "This promo code has reached its redemption limit",
  already_redeemed: "You have already redeemed this promo code",
};

export async function applyPromoAction(formData: FormData) {
  const parsed = applyPromoSchema.parse({
    code: formData.get("code"),
  });
  const [cart, session] = await Promise.all([getCart(), getSession()]);
  const result = await validatePromo({
    code: parsed.code,
    userId: session.userId,
    subtotalCents: cart.subtotalCents,
  });

  if (!result.ok) {
    throw new Error(rejectionMessages[result.reason]);
  }

  await setPromoCodeId(result.promo.id);
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function removePromoAction() {
  await setPromoCodeId(null);
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function createPromoAction(formData: FormData) {
  await requireAdmin();
  const parsed = createPromoSchema.parse({
    code: formData.get("code"),
    kind: formData.get("kind"),
    valueInt: formData.get("valueInt"),
    minSubtotalCents: formData.get("minSubtotalCents"),
    maxRedemptions: formData.get("maxRedemptions"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
  });
  const code = parsed.code.toUpperCase();
  const [existing] = await db
    .select({ id: promoCodes.id })
    .from(promoCodes)
    .where(eq(promoCodes.code, code));
  if (existing) {
    throw new Error("Promo code already exists");
  }

  await db.insert(promoCodes).values({
    id: `promo_${nanoid(10)}`,
    code,
    kind: parsed.kind,
    valueInt: parsed.valueInt,
    minSubtotalCents: parsed.minSubtotalCents,
    maxRedemptions: parsed.maxRedemptions ?? null,
    startsAt: parsed.startsAt,
    endsAt: parsed.endsAt ?? null,
  });
  revalidatePath("/admin");
}

export async function deactivatePromoAction(formData: FormData) {
  await requireAdmin();
  const parsed = deactivatePromoSchema.parse({
    id: formData.get("id"),
  });
  await db
    .update(promoCodes)
    .set({ active: false })
    .where(eq(promoCodes.id, parsed.id));
  revalidatePath("/admin");
  revalidatePath("/cart");
  revalidatePath("/checkout");
}
