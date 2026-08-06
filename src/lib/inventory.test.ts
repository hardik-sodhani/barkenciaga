import { describe, expect, it } from "vitest";
import {
  LIMITED_QUANTITIES_LABEL,
  LOW_STOCK_THRESHOLD,
  isLowStock,
  lowStockBadgeLabel,
} from "@/lib/inventory";

describe("LOW_STOCK_THRESHOLD", () => {
  it("is 6", () => {
    expect(LOW_STOCK_THRESHOLD).toBe(6);
  });
});

describe("LIMITED_QUANTITIES_LABEL", () => {
  it('is "Limited quantities"', () => {
    expect(LIMITED_QUANTITIES_LABEL).toBe("Limited quantities");
  });
});

describe("isLowStock", () => {
  it("returns true when inventory is below the threshold", () => {
    expect(isLowStock(5)).toBe(true);
  });

  it("returns false when inventory equals the threshold", () => {
    expect(isLowStock(6)).toBe(false);
  });

  it("returns true when inventory is zero", () => {
    expect(isLowStock(0)).toBe(true);
  });
});

describe("lowStockBadgeLabel", () => {
  it("formats the remaining inventory count", () => {
    expect(lowStockBadgeLabel(3)).toBe("Only 3 left");
  });
});
