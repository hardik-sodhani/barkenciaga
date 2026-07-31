import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PromoCode } from "@/db/schema";

const { db, queryResults } = vi.hoisted(() => {
  const results: unknown[][] = [];
  return {
    queryResults: results,
    db: {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(async () => results.shift() ?? []),
        })),
      })),
    },
  };
});

vi.mock("@/db", () => ({ db }));
vi.mock("@/db/bootstrap", () => ({ ensureDbReady: vi.fn() }));

import { validatePromo } from "@/lib/promos";

const basePromo: PromoCode = {
  id: "promo_test",
  code: "WOOF10",
  kind: "percent",
  valueInt: 10,
  minSubtotalCents: 0,
  maxRedemptions: null,
  redemptionsCount: 0,
  startsAt: new Date("2026-01-01T00:00:00.000Z"),
  endsAt: null,
  active: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

const now = new Date("2026-07-01T00:00:00.000Z");

function queuePromo(promo: PromoCode | undefined, redemption?: { id: string }) {
  queryResults.push(promo ? [promo] : []);
  if (redemption !== undefined) queryResults.push([redemption]);
}

describe("validatePromo", () => {
  beforeEach(() => {
    queryResults.length = 0;
    vi.clearAllMocks();
  });

  it("matches codes case-insensitively and calculates percent discounts", async () => {
    queuePromo(basePromo);

    const result = await validatePromo({
      code: " woof10 ",
      userId: null,
      subtotalCents: 15_555,
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      discountCents: 1_556,
      promo: { id: "promo_test" },
    });
  });

  it("calculates fixed discounts and caps them at the subtotal", async () => {
    queuePromo({ ...basePromo, kind: "fixed", valueInt: 2_000 });

    const result = await validatePromo({
      promoId: "promo_test",
      userId: null,
      subtotalCents: 1_500,
      now,
    });

    expect(result).toMatchObject({ ok: true, discountCents: 1_500 });
  });

  it.each([
    ["not_found", undefined],
    ["inactive", { ...basePromo, active: false }],
    [
      "not_started",
      { ...basePromo, startsAt: new Date("2026-08-01T00:00:00.000Z") },
    ],
    [
      "expired",
      { ...basePromo, endsAt: new Date("2026-06-01T00:00:00.000Z") },
    ],
    ["min_subtotal", { ...basePromo, minSubtotalCents: 20_000 }],
    [
      "max_redemptions",
      { ...basePromo, maxRedemptions: 5, redemptionsCount: 5 },
    ],
  ] as const)("rejects promos that are %s", async (reason, promo) => {
    queuePromo(promo);

    const result = await validatePromo({
      code: "WOOF10",
      userId: null,
      subtotalCents: 10_000,
      now,
    });

    expect(result).toEqual({ ok: false, reason });
  });

  it("rejects a promo already redeemed by the signed-in user", async () => {
    queuePromo(basePromo, { id: "pr_existing" });

    const result = await validatePromo({
      promoId: basePromo.id,
      userId: "usr_demo_customer",
      subtotalCents: 10_000,
      now,
    });

    expect(result).toEqual({ ok: false, reason: "already_redeemed" });
  });
});
