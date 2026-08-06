import { describe, expect, it, vi } from "vitest";
import {
  computeDiscountCents,
  normalizePromoCode,
  promoFailureMessage,
  validatePromo,
  type PromoRecord,
} from "@/lib/promos";

vi.mock("@/db", () => ({ db: {} }));
vi.mock("@/db/bootstrap", () => ({ ensureDbReady: vi.fn() }));

const basePromo: PromoRecord = {
  id: "promo_test",
  code: "TEST10",
  kind: "percent",
  valueInt: 10,
  minSubtotalCents: 0,
  maxRedemptions: null,
  redemptionsCount: 0,
  startsAt: new Date("2024-01-01T00:00:00.000Z"),
  endsAt: new Date("2030-12-31T23:59:59.000Z"),
  active: true,
};

const now = new Date("2025-06-01T12:00:00.000Z");

describe("normalizePromoCode", () => {
  it("trims whitespace and uppercases", () => {
    expect(normalizePromoCode("  woofer20  ")).toBe("WOOFER20");
    expect(normalizePromoCode("bark10")).toBe("BARK10");
  });
});

describe("computeDiscountCents", () => {
  it("applies percent discount with floor rounding", () => {
    expect(computeDiscountCents({ kind: "percent", valueInt: 20 }, 10000)).toBe(2000);
    expect(computeDiscountCents({ kind: "percent", valueInt: 20 }, 999)).toBe(199);
  });

  it("applies fixed discount capped at subtotal", () => {
    expect(computeDiscountCents({ kind: "fixed", valueInt: 1000 }, 5000)).toBe(1000);
    expect(computeDiscountCents({ kind: "fixed", valueInt: 1000 }, 500)).toBe(500);
  });

  it("never returns negative discount or exceeds subtotal", () => {
    expect(computeDiscountCents({ kind: "percent", valueInt: 10 }, 0)).toBe(0);
    expect(computeDiscountCents({ kind: "fixed", valueInt: 5000 }, 1000)).toBe(1000);
    expect(computeDiscountCents({ kind: "percent", valueInt: 10 }, -100)).toBe(0);
  });
});

describe("validatePromo", () => {
  it("returns not_found when promo is missing", () => {
    expect(
      validatePromo({
        promo: null,
        subtotalCents: 10000,
        alreadyRedeemedByUser: false,
        now,
      }),
    ).toEqual({ ok: false, reason: "not_found" });
  });

  it("returns inactive when promo is not active", () => {
    expect(
      validatePromo({
        promo: { ...basePromo, active: false },
        subtotalCents: 10000,
        alreadyRedeemedByUser: false,
        now,
      }),
    ).toEqual({ ok: false, reason: "inactive" });
  });

  it("returns not_started before startsAt", () => {
    expect(
      validatePromo({
        promo: basePromo,
        subtotalCents: 10000,
        alreadyRedeemedByUser: false,
        now: new Date("2023-01-01T00:00:00.000Z"),
      }),
    ).toEqual({ ok: false, reason: "not_started" });
  });

  it("returns expired after endsAt", () => {
    expect(
      validatePromo({
        promo: { ...basePromo, endsAt: new Date("2024-12-31T23:59:59.000Z") },
        subtotalCents: 10000,
        alreadyRedeemedByUser: false,
        now: new Date("2025-01-01T00:00:00.000Z"),
      }),
    ).toEqual({ ok: false, reason: "expired" });
  });

  it("returns min_subtotal when subtotal is too low", () => {
    expect(
      validatePromo({
        promo: { ...basePromo, minSubtotalCents: 5000 },
        subtotalCents: 4999,
        alreadyRedeemedByUser: false,
        now,
      }),
    ).toEqual({ ok: false, reason: "min_subtotal" });
  });

  it("returns max_redemptions when limit is reached", () => {
    expect(
      validatePromo({
        promo: { ...basePromo, maxRedemptions: 1, redemptionsCount: 1 },
        subtotalCents: 10000,
        alreadyRedeemedByUser: false,
        now,
      }),
    ).toEqual({ ok: false, reason: "max_redemptions" });
  });

  it("returns already_redeemed for signed-in users who used the code", () => {
    expect(
      validatePromo({
        promo: basePromo,
        userId: "usr_1",
        subtotalCents: 10000,
        alreadyRedeemedByUser: true,
        now,
      }),
    ).toEqual({ ok: false, reason: "already_redeemed" });
  });

  it("skips already_redeemed check for guests", () => {
    expect(
      validatePromo({
        promo: basePromo,
        subtotalCents: 10000,
        alreadyRedeemedByUser: true,
        now,
      }),
    ).toMatchObject({ ok: true, discountCents: 1000 });
  });

  it("succeeds with percent discount", () => {
    expect(
      validatePromo({
        promo: { ...basePromo, kind: "percent", valueInt: 20 },
        subtotalCents: 10000,
        alreadyRedeemedByUser: false,
        now,
      }),
    ).toEqual({
      ok: true,
      discountCents: 2000,
      promo: { ...basePromo, kind: "percent", valueInt: 20 },
    });
  });

  it("succeeds with fixed discount", () => {
    expect(
      validatePromo({
        promo: { ...basePromo, kind: "fixed", valueInt: 1000 },
        subtotalCents: 10000,
        alreadyRedeemedByUser: false,
        now,
      }),
    ).toEqual({
      ok: true,
      discountCents: 1000,
      promo: { ...basePromo, kind: "fixed", valueInt: 1000 },
    });
  });
});

describe("promoFailureMessage", () => {
  it("returns a message for every fail reason", () => {
    const reasons = [
      "not_found",
      "inactive",
      "not_started",
      "expired",
      "min_subtotal",
      "max_redemptions",
      "already_redeemed",
    ] as const;

    for (const reason of reasons) {
      expect(promoFailureMessage(reason)).toMatch(/\S/);
    }
  });
});
