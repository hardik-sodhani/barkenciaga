import { beforeEach, describe, expect, it, vi } from "vitest";

const selectDistinctMock = vi.fn();
vi.mock("@/db", () => ({
  db: {
    selectDistinct: (...args: unknown[]) => selectDistinctMock(...args),
  },
}));
vi.mock("@/db/bootstrap", () => ({ ensureDbReady: vi.fn() }));

import {
  LOW_STOCK_EYEBROW,
  LOW_STOCK_THRESHOLD,
  getLowStockProductIds,
  isLowStock,
} from "@/lib/inventory";

describe("isLowStock", () => {
  it("is true strictly below the threshold", () => {
    expect(isLowStock(0)).toBe(true);
    expect(isLowStock(5)).toBe(true);
    expect(isLowStock(LOW_STOCK_THRESHOLD - 1)).toBe(true);
  });

  it("is false at or above the threshold", () => {
    expect(isLowStock(6)).toBe(false);
    expect(isLowStock(LOW_STOCK_THRESHOLD)).toBe(false);
    expect(isLowStock(12)).toBe(false);
  });
});

describe("constants", () => {
  it("exports the agreed eyebrow copy and threshold", () => {
    expect(LOW_STOCK_THRESHOLD).toBe(6);
    expect(LOW_STOCK_EYEBROW).toBe("Limited quantities");
  });
});

describe("getLowStockProductIds", () => {
  beforeEach(() => {
    selectDistinctMock.mockReset();
  });

  it("returns an empty set when given no product ids", async () => {
    await expect(getLowStockProductIds([])).resolves.toEqual(new Set());
    expect(selectDistinctMock).not.toHaveBeenCalled();
  });

  it("returns distinct product ids that have any low-stock variant", async () => {
    selectDistinctMock.mockReturnValue({
      from: () => ({
        where: async () => [
          { productId: "p1" },
          { productId: "p1" },
          { productId: "p2" },
        ],
      }),
    });

    const result = await getLowStockProductIds(["p1", "p2", "p3"]);
    expect(result).toEqual(new Set(["p1", "p2"]));
    expect(selectDistinctMock).toHaveBeenCalledOnce();
  });
});
