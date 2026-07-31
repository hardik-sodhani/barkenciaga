import { describe, expect, it, vi } from "vitest";
import {
  getCartTotals,
  shippingCentsFor,
  taxCentsFor,
} from "@/lib/cart";

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
  it("matches cart and checkout page preview math", () => {
    expect(getCartTotals(15_000).totalCents).toBe(15_000 + 1_200 + 1_088);
  });

  it("calculates tax after discount while retaining raw-subtotal shipping", () => {
    expect(getCartTotals(15_000, 2_000)).toEqual({
      discountCents: 2_000,
      shippingCents: 1_200,
      taxCents: 942,
      totalCents: 15_142,
    });
  });
});
