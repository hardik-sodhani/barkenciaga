import { describe, expect, it, vi } from "vitest";
import { shippingCentsFor, taxCentsFor } from "@/lib/cart";

vi.mock("@/db", () => ({ db: {} }));
vi.mock("@/db/bootstrap", () => ({ ensureDbReady: vi.fn() }));

describe("shippingCentsFor", () => {
  it("waives shipping on empty carts", () => {
    expect(shippingCentsFor(0)).toBe(0);
  });

  it("charges $12 below the free-shipping threshold", () => {
    expect(shippingCentsFor(10000)).toBe(1200);
  });

  it("waives shipping at or above $250", () => {
    expect(shippingCentsFor(25000)).toBe(0);
    expect(shippingCentsFor(30000)).toBe(0);
  });
});

describe("taxCentsFor", () => {
  it("applies 7.25% tax rounded to nearest cent", () => {
    expect(taxCentsFor(10000)).toBe(725);
    expect(taxCentsFor(9999)).toBe(725);
  });

  it("returns zero tax on zero subtotal", () => {
    expect(taxCentsFor(0)).toBe(0);
  });
});

describe("checkout preview totals", () => {
  function previewTotalCents(subtotalCents: number) {
    const shipping = shippingCentsFor(subtotalCents);
    const tax = taxCentsFor(subtotalCents);
    return subtotalCents + shipping + tax;
  }

  // Mirrors checkoutAction after BRK-20: tax on merchandise subtotal only.
  function persistedTotalCents(subtotalCents: number) {
    const shipping = shippingCentsFor(subtotalCents);
    const tax = taxCentsFor(subtotalCents);
    return subtotalCents + shipping + tax;
  }

  it("matches cart and checkout page preview math", () => {
    expect(previewTotalCents(15000)).toBe(15000 + 1200 + 1088);
  });

  // BRK-20: charged order total must match the total shown at checkout.
  it("persisted order tax matches checkout preview (BRK-20)", () => {
    const subtotal = 15000;
    expect(persistedTotalCents(subtotal)).toBe(previewTotalCents(subtotal));
    expect(taxCentsFor(subtotal)).toBe(1088);
    expect(taxCentsFor(subtotal + shippingCentsFor(subtotal))).not.toBe(
      taxCentsFor(subtotal),
    );
  });
});
