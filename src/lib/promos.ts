import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureDbReady } from "@/db/bootstrap";
import {
  promoCodes,
  promoRedemptions,
  type PromoCode,
} from "@/db/schema";

export type PromoRejectionReason =
  | "not_found"
  | "inactive"
  | "expired"
  | "not_started"
  | "min_subtotal"
  | "max_redemptions"
  | "already_redeemed";

export type PromoValidationResult =
  | { ok: true; promo: PromoCode; discountCents: number }
  | { ok: false; reason: PromoRejectionReason };

type ValidatePromoInput = {
  code?: string;
  promoId?: string;
  userId: string | null;
  subtotalCents: number;
  now?: Date;
};

export async function validatePromo({
  code,
  promoId,
  userId,
  subtotalCents,
  now = new Date(),
}: ValidatePromoInput): Promise<PromoValidationResult> {
  await ensureDbReady();

  if (!code && !promoId) {
    return { ok: false, reason: "not_found" };
  }

  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(
      promoId
        ? eq(promoCodes.id, promoId)
        : eq(promoCodes.code, code!.trim().toUpperCase()),
    );

  if (!promo) return { ok: false, reason: "not_found" };
  if (!promo.active) return { ok: false, reason: "inactive" };
  if (promo.startsAt > now) return { ok: false, reason: "not_started" };
  if (promo.endsAt && promo.endsAt <= now) {
    return { ok: false, reason: "expired" };
  }
  if (subtotalCents < promo.minSubtotalCents) {
    return { ok: false, reason: "min_subtotal" };
  }
  if (
    promo.maxRedemptions !== null &&
    promo.redemptionsCount >= promo.maxRedemptions
  ) {
    return { ok: false, reason: "max_redemptions" };
  }

  if (userId) {
    const [redemption] = await db
      .select({ id: promoRedemptions.id })
      .from(promoRedemptions)
      .where(
        and(
          eq(promoRedemptions.promoId, promo.id),
          eq(promoRedemptions.userId, userId),
        ),
      );
    if (redemption) {
      return { ok: false, reason: "already_redeemed" };
    }
  }

  const uncappedDiscount =
    promo.kind === "percent"
      ? Math.round((subtotalCents * promo.valueInt) / 100)
      : promo.valueInt;

  return {
    ok: true,
    promo,
    discountCents: Math.min(subtotalCents, uncappedDiscount),
  };
}
