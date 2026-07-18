import { describe, expect, it } from "vitest";
import {
  computePersistedOrderTotals,
  computePreviewTotals,
} from "@/lib/checkout-totals";

describe("computePreviewTotals", () => {
  it("matches cart and checkout page summary math", () => {
    expect(computePreviewTotals(15000)).toEqual({
      subtotalCents: 15000,
      shippingCents: 1200,
      taxCents: 1088,
      totalCents: 17288,
    });
  });

  it("waives shipping and tax on empty carts", () => {
    expect(computePreviewTotals(0)).toEqual({
      subtotalCents: 0,
      shippingCents: 0,
      taxCents: 0,
      totalCents: 0,
    });
  });
});

describe("computePersistedOrderTotals", () => {
  it("taxes subtotal plus shipping when persisting orders", () => {
    expect(computePersistedOrderTotals(15000)).toEqual({
      subtotalCents: 15000,
      shippingCents: 1200,
      taxCents: 1175,
      totalCents: 17375,
    });
  });

  // BRK-20: checkoutAction taxes subtotal+shipping while preview taxes subtotal only.
  it.fails("persisted order totals match checkout preview (BRK-20)", () => {
    const subtotal = 15000;
    expect(computePersistedOrderTotals(subtotal)).toEqual(
      computePreviewTotals(subtotal),
    );
  });
});
