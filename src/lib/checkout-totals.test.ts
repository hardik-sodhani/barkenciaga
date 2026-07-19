import { describe, expect, it } from "vitest";
import {
  checkoutPersistedTaxCents,
  checkoutPersistedTotalCents,
  checkoutPreviewTaxCents,
  checkoutPreviewTotalCents,
} from "@/lib/checkout-totals";

describe("checkoutPreviewTotalCents", () => {
  it("matches cart and checkout page order summary", () => {
    expect(checkoutPreviewTotalCents(15000)).toBe(15000 + 1200 + 1088);
  });

  it("waives shipping and tax on empty carts", () => {
    expect(checkoutPreviewTotalCents(0)).toBe(0);
  });
});

describe("checkoutPersistedTotalCents", () => {
  it("taxes subtotal plus shipping when persisting the order", () => {
    expect(checkoutPersistedTotalCents(15000)).toBe(15000 + 1200 + 1175);
  });
});

describe("checkout tax base contract", () => {
  // BRK-20: checkoutAction taxes subtotal+shipping while preview taxes subtotal only.
  it.fails("persisted order tax matches checkout preview (BRK-20)", () => {
    const subtotal = 15000;
    expect(checkoutPersistedTaxCents(subtotal)).toBe(
      checkoutPreviewTaxCents(subtotal),
    );
    expect(checkoutPersistedTotalCents(subtotal)).toBe(
      checkoutPreviewTotalCents(subtotal),
    );
  });
});
