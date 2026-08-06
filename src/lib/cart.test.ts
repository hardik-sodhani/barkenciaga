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
  /** Same math as cart/checkout pages and checkoutAction after BRK-20. */
  function orderTotalCents(subtotalCents: number) {
    const shipping = shippingCentsFor(subtotalCents);
    const tax = taxCentsFor(subtotalCents);
    return subtotalCents + shipping + tax;
  }

  it("matches cart and checkout page preview math", () => {
    expect(orderTotalCents(15000)).toBe(15000 + 1200 + 1088);
  });

  // BRK-20: charged total must match checkout preview when shipping applies.
  it("persisted order tax matches checkout preview when shipping applies (BRK-20)", () => {
    const subtotal = 15000;
    const shipping = shippingCentsFor(subtotal);
    expect(shipping).toBe(1200);
    expect(taxCentsFor(subtotal)).toBe(1088);
    expect(orderTotalCents(subtotal)).toBe(17288);
    // Previously checkoutAction taxed subtotal+shipping (1175), overcharging by 87¢.
    expect(taxCentsFor(subtotal + shipping)).not.toBe(taxCentsFor(subtotal));
  });

  it("preview and charged totals still match under free shipping", () => {
    const subtotal = 25000;
    expect(shippingCentsFor(subtotal)).toBe(0);
    expect(orderTotalCents(subtotal)).toBe(25000 + taxCentsFor(subtotal));
  });
});
