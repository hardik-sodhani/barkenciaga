import { describe, expect, it } from "vitest";
import { isLowStock, productHasLowStock } from "@/lib/inventory";

describe("isLowStock", () => {
  it("returns true when inventory is below the threshold", () => {
    expect(isLowStock(5)).toBe(true);
    expect(isLowStock(0)).toBe(true);
  });

  it("returns false when inventory meets or exceeds the threshold", () => {
    expect(isLowStock(6)).toBe(false);
  });
});

describe("productHasLowStock", () => {
  it("returns true when any variant is low stock", () => {
    expect(productHasLowStock([12, 5])).toBe(true);
  });

  it("returns false when all variants meet the threshold", () => {
    expect(productHasLowStock([12, 6])).toBe(false);
  });

  it("returns false for empty inventories", () => {
    expect(productHasLowStock([])).toBe(false);
  });
});
