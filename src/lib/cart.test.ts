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
  /** Cart + checkout page order summary. */
  function previewTotalCents(subtotalCents: number) {
    const shipping = shippingCentsFor(subtotalCents);
    const tax = taxCentsFor(subtotalCents);
    return subtotalCents + shipping + tax;
  }

  /** checkoutAction persisted/charged total (must stay in lockstep with preview). */
  function persistedTotalCents(subtotalCents: number) {
    const shipping = shippingCentsFor(subtotalCents);
    const tax = taxCentsFor(subtotalCents);
    return subtotalCents + shipping + tax;
  }

  it("matches cart and checkout page preview math", () => {
    expect(previewTotalCents(15000)).toBe(15000 + 1200 + 1088);
  });

  // BRK-20 regression: shipping fee must not inflate tax on the charged order.
  it("persisted order total matches checkout preview when shipping applies", () => {
    const subtotal = 15000;
    expect(shippingCentsFor(subtotal)).toBe(1200);
    expect(persistedTotalCents(subtotal)).toBe(previewTotalCents(subtotal));
    // Taxing shipping would overcharge by round(1200 * 0.0725) = 87 cents.
    expect(persistedTotalCents(subtotal)).toBe(15000 + 1200 + 1088);
  });

  it("preview and charge stay aligned when shipping is waived", () => {
    const subtotal = 25000;
    expect(shippingCentsFor(subtotal)).toBe(0);
    expect(persistedTotalCents(subtotal)).toBe(previewTotalCents(subtotal));
  });
});
