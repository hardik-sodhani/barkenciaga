import { describe, expect, it } from "vitest";
import { formatPrice, formatPriceShort } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats whole-dollar USD amounts", () => {
    expect(formatPrice(12500)).toBe("$125");
  });

  it("rounds fractional cents for display", () => {
    expect(formatPrice(9999)).toBe("$100");
  });
});

describe("formatPriceShort", () => {
  it("prefixes rounded dollars with $", () => {
    expect(formatPriceShort(25000)).toBe("$250");
  });
});
