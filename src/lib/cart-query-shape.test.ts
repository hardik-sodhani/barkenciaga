import { describe, expect, it } from "vitest";
import {
  getCartSelectCountForLineCount,
  optimalGetCartSelectCountForLineCount,
} from "@/lib/cart-query-shape";

describe("getCartSelectCountForLineCount", () => {
  it("uses one query for an empty cart with a cart id", () => {
    expect(getCartSelectCountForLineCount(0)).toBe(1);
  });

  it("adds two selects per line for variant and product lookups", () => {
    expect(getCartSelectCountForLineCount(1)).toBe(3);
    expect(getCartSelectCountForLineCount(4)).toBe(9);
  });
});

describe("getCart query optimization contract", () => {
  // TECH_DEBT.md item 6: getCart currently issues 1 + 2N SELECTs.
  it.fails("collapses variant and product lookups into a constant query count", () => {
    expect(getCartSelectCountForLineCount(4)).toBe(
      optimalGetCartSelectCountForLineCount(4),
    );
  });
});
