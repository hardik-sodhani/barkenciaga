import { describe, expect, it } from "vitest";
import {
  getCartQueryPhase,
  getCartSelectCountForLoadedCart,
  getCartSelectCountIdeal,
} from "@/lib/cart-query-shape";

describe("getCartQueryPhase", () => {
  it("skips DB work when there is no cart cookie", () => {
    expect(getCartQueryPhase(false, 0)).toBe("no-session");
  });

  it("treats an empty persisted cart as a single items lookup", () => {
    expect(getCartQueryPhase(true, 0)).toBe("empty-cart");
  });
});

describe("getCartSelectCountForLoadedCart", () => {
  it("uses one items query plus two lookups per line", () => {
    expect(getCartSelectCountForLoadedCart(1)).toBe(3);
    expect(getCartSelectCountForLoadedCart(4)).toBe(9);
  });
});

describe("getCart N+1 contract", () => {
  // TECH_DEBT item 6: getCart uses 1+2N SELECTs instead of a collapsed JOIN.
  it.fails("loaded carts use a single relational query (TECH_DEBT #6)", () => {
    const lineCount = 4;
    expect(getCartSelectCountForLoadedCart(lineCount)).toBe(
      getCartSelectCountIdeal(lineCount),
    );
  });
});
