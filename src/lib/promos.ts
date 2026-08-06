import "server-only";
import { db } from "@/db";
import { promoCodes, promoRedemptions } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";

export type PromoKind = "percent" | "fixed";

export type PromoRecord = {
  id: string;
  code: string;
  kind: PromoKind;
  valueInt: number;
  minSubtotalCents: number;
  maxRedemptions: number | null;
  redemptionsCount: number;
  startsAt: Date;
  endsAt: Date | null;
  active: boolean;
};

export type PromoFailReason =
  | "not_found"
  | "inactive"
  | "not_started"
  | "expired"
  | "min_subtotal"
  | "max_redemptions"
  | "already_redeemed";

export type ValidatePromoResult =
  | { ok: true; discountCents: number; promo: PromoRecord }
  | { ok: false; reason: PromoFailReason };

function toPromoRecord(row: typeof promoCodes.$inferSelect): PromoRecord {
  return {
    id: row.id,
    code: row.code,
    kind: row.kind,
    valueInt: row.valueInt,
    minSubtotalCents: row.minSubtotalCents,
    maxRedemptions: row.maxRedemptions,
    redemptionsCount: row.redemptionsCount,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
    active: row.active,
  };
}

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function computeDiscountCents(
  promo: Pick<PromoRecord, "kind" | "valueInt">,
  subtotalCents: number,
): number {
  const subtotal = Math.max(0, subtotalCents);
  let discount: number;
  if (promo.kind === "percent") {
    discount = Math.floor((subtotal * promo.valueInt) / 100);
  } else {
    discount = Math.min(promo.valueInt, subtotal);
  }
  return Math.min(Math.max(0, discount), subtotal);
}

export function validatePromo({
  promo,
  userId,
  subtotalCents,
  alreadyRedeemedByUser,
  now = new Date(),
}: {
  promo: PromoRecord | null | undefined;
  userId?: string | null;
  subtotalCents: number;
  alreadyRedeemedByUser: boolean;
  now?: Date;
}): ValidatePromoResult {
  if (!promo) {
    return { ok: false, reason: "not_found" };
  }
  if (!promo.active) {
    return { ok: false, reason: "inactive" };
  }
  if (now < promo.startsAt) {
    return { ok: false, reason: "not_started" };
  }
  if (promo.endsAt && now > promo.endsAt) {
    return { ok: false, reason: "expired" };
  }
  if (subtotalCents < promo.minSubtotalCents) {
    return { ok: false, reason: "min_subtotal" };
  }
  if (promo.maxRedemptions != null && promo.redemptionsCount >= promo.maxRedemptions) {
    return { ok: false, reason: "max_redemptions" };
  }
  if (userId && alreadyRedeemedByUser) {
    return { ok: false, reason: "already_redeemed" };
  }

  const discountCents = computeDiscountCents(promo, subtotalCents);
  return { ok: true, discountCents, promo };
}

export function promoFailureMessage(reason: PromoFailReason): string {
  switch (reason) {
    case "not_found":
      return "Promo code not found.";
    case "inactive":
      return "This promo code is no longer active.";
    case "not_started":
      return "This promo code is not valid yet.";
    case "expired":
      return "This promo code has expired.";
    case "min_subtotal":
      return "Order subtotal is below the minimum for this promo.";
    case "max_redemptions":
      return "This promo code has reached its redemption limit.";
    case "already_redeemed":
      return "You have already used this promo code.";
    default: {
      const _exhaustive: never = reason;
      return _exhaustive;
    }
  }
}

export async function getPromoByCode(code: string): Promise<PromoRecord | null> {
  await ensureDbReady();
  const normalized = normalizePromoCode(code);
  if (!normalized) return null;

  const [row] = await db
    .select()
    .from(promoCodes)
    .where(sql`upper(${promoCodes.code}) = ${normalized}`);
  return row ? toPromoRecord(row) : null;
}

export async function getPromoById(id: string): Promise<PromoRecord | null> {
  await ensureDbReady();
  const [row] = await db.select().from(promoCodes).where(eq(promoCodes.id, id));
  return row ? toPromoRecord(row) : null;
}

export async function userHasRedeemedPromo(
  promoId: string,
  userId: string,
): Promise<boolean> {
  await ensureDbReady();
  const [row] = await db
    .select({ id: promoRedemptions.id })
    .from(promoRedemptions)
    .where(and(eq(promoRedemptions.promoId, promoId), eq(promoRedemptions.userId, userId)));
  return Boolean(row);
}

export async function validatePromoCode({
  code,
  userId,
  subtotalCents,
}: {
  code: string;
  userId?: string | null;
  subtotalCents: number;
}): Promise<ValidatePromoResult> {
  const promo = await getPromoByCode(code);
  const alreadyRedeemedByUser =
    promo && userId ? await userHasRedeemedPromo(promo.id, userId) : false;
  return validatePromo({ promo, userId, subtotalCents, alreadyRedeemedByUser });
}
