import { describe, expect, it } from "vitest";
import {
  clampZoom,
  getAdjacentImageIndex,
  getPinchDistance,
  getSwipeDirection,
  isCompleteImageOrder,
} from "./product-gallery";

describe("product gallery navigation", () => {
  it("wraps arrow navigation at both ends", () => {
    expect(getAdjacentImageIndex(0, 3, -1)).toBe(2);
    expect(getAdjacentImageIndex(2, 3, 1)).toBe(0);
    expect(getAdjacentImageIndex(0, 1, 1)).toBe(0);
  });

  it("ignores short swipes and maps deliberate swipes to navigation", () => {
    expect(getSwipeDirection(100, 70)).toBe(0);
    expect(getSwipeDirection(100, 40)).toBe(1);
    expect(getSwipeDirection(40, 100)).toBe(-1);
  });

  it("calculates touch distance and bounds zoom", () => {
    expect(
      getPinchDistance(
        { clientX: 0, clientY: 0 },
        { clientX: 30, clientY: 40 },
      ),
    ).toBe(50);
    expect(clampZoom(0.5)).toBe(1);
    expect(clampZoom(2.5)).toBe(2.5);
    expect(clampZoom(5)).toBe(4);
  });
});

describe("product image ordering", () => {
  it("accepts only a complete, duplicate-free permutation", () => {
    const existing = ["a", "b", "c"];
    expect(isCompleteImageOrder(existing, ["c", "a", "b"])).toBe(true);
    expect(isCompleteImageOrder(existing, ["a", "b"])).toBe(false);
    expect(isCompleteImageOrder(existing, ["a", "a", "c"])).toBe(false);
    expect(isCompleteImageOrder(existing, ["a", "b", "x"])).toBe(false);
  });
});
