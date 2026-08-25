import { describe, expect, it, vi } from "vitest";
import { cartTotalsFor, shippingCentsFor, taxCentsFor } from "@/lib/cart";

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

describe("cartTotalsFor", () => {
  it("taxes merchandise subtotal only when shipping applies (BRK-20)", () => {
    expect(cartTotalsFor(15000)).toEqual({
      shippingCents: 1200,
      taxCents: 1088,
      totalCents: 17288,
    });
  });

  it("matches preview and persisted totals at the free-shipping threshold", () => {
    expect(cartTotalsFor(25000)).toEqual({
      shippingCents: 0,
      taxCents: 1812,
      totalCents: 26812,
    });
  });
});
