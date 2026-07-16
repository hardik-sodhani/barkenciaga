import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { promoCodes, promoRedemptions, type PromoCode } from "@/db/schema";
import { ensureDbReady } from "@/db/bootstrap";

export type PromoFailureReason =
  | "not_found"
  | "inactive"
  | "not_started"
  | "expired"
  | "min_subtotal"
  | "max_redemptions"
  | "already_redeemed";

export type ValidatePromoOk = {
  ok: true;
  promo: PromoCode;
  discountCents: number;
};

export type ValidatePromoFail = {
  ok: false;
  reason: PromoFailureReason;
  message: string;
};

export type ValidatePromoResult = ValidatePromoOk | ValidatePromoFail;

const REASON_MESSAGES: Record<PromoFailureReason, string> = {
  not_found: "That promo code wasn’t found.",
  inactive: "That promo code is no longer active.",
  not_started: "That promo code isn’t available yet.",
  expired: "That promo code has expired.",
  min_subtotal: "Your bag doesn’t meet the minimum for this promo.",
  max_redemptions: "That promo code has reached its redemption limit.",
  already_redeemed: "You’ve already used this promo code.",
};

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase();
}

export function computeDiscountCents(promo: PromoCode, subtotalCents: number) {
  if (subtotalCents <= 0) return 0;
  if (promo.kind === "percent") {
    const raw = Math.round((subtotalCents * promo.valueInt) / 100);
    return Math.min(subtotalCents, Math.max(0, raw));
  }
  if (promo.kind === "fixed") {
    return Math.min(subtotalCents, Math.max(0, promo.valueInt));
  }
  const _exhaustive: never = promo.kind;
  return _exhaustive;
}

export function promoFailureMessage(reason: PromoFailureReason) {
  return REASON_MESSAGES[reason];
}

async function findPromoByCode(code: string) {
  const normalized = normalizePromoCode(code);
  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(sql`upper(${promoCodes.code}) = ${normalized}`)
    .limit(1);
  return promo ?? null;
}

export async function getPromoById(id: string) {
  await ensureDbReady();
  const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.id, id)).limit(1);
  return promo ?? null;
}

export async function listPromoCodes() {
  await ensureDbReady();
  return db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
}

export async function validatePromo(input: {
  code?: string;
  promoId?: string;
  userId: string | null;
  subtotalCents: number;
}): Promise<ValidatePromoResult> {
  await ensureDbReady();

  let promo: PromoCode | null = null;
  if (input.promoId) {
    promo = await getPromoById(input.promoId);
  } else if (input.code) {
    promo = await findPromoByCode(input.code);
  }

  if (!promo) {
    return { ok: false, reason: "not_found", message: REASON_MESSAGES.not_found };
  }

  if (!promo.active) {
    return { ok: false, reason: "inactive", message: REASON_MESSAGES.inactive };
  }

  const now = Date.now();
  if (promo.startsAt && promo.startsAt.getTime() > now) {
    return { ok: false, reason: "not_started", message: REASON_MESSAGES.not_started };
  }
  if (promo.endsAt && promo.endsAt.getTime() < now) {
    return { ok: false, reason: "expired", message: REASON_MESSAGES.expired };
  }

  if (input.subtotalCents < promo.minSubtotalCents) {
    return {
      ok: false,
      reason: "min_subtotal",
      message: `${REASON_MESSAGES.min_subtotal} Minimum ${formatDollars(promo.minSubtotalCents)}.`,
    };
  }

  if (
    promo.maxRedemptions != null &&
    promo.redemptionsCount >= promo.maxRedemptions
  ) {
    return {
      ok: false,
      reason: "max_redemptions",
      message: REASON_MESSAGES.max_redemptions,
    };
  }

  if (input.userId) {
    const [prior] = await db
      .select({ id: promoRedemptions.id })
      .from(promoRedemptions)
      .where(
        and(
          eq(promoRedemptions.promoId, promo.id),
          eq(promoRedemptions.userId, input.userId),
        ),
      )
      .limit(1);
    if (prior) {
      return {
        ok: false,
        reason: "already_redeemed",
        message: REASON_MESSAGES.already_redeemed,
      };
    }
  }

  return {
    ok: true,
    promo,
    discountCents: computeDiscountCents(promo, input.subtotalCents),
  };
}

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
