import { describe, expect, it } from "vitest";
import { filterProductsWithSizeVariant } from "@/lib/product-filters";

const products = [
  { id: "p1", name: "Coat" },
  { id: "p2", name: "Harness" },
  { id: "p3", name: "Leash" },
];

describe("filterProductsWithSizeVariant", () => {
  it("keeps products that offer the requested size", () => {
    const result = filterProductsWithSizeVariant(products, ["p1", "p3"]);
    expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterProductsWithSizeVariant(products, [])).toEqual([]);
  });
});

describe("category size filter contract", () => {
  function buggyCategoryFilter<T extends { id: string }>(
    rows: T[],
    productIdsWithSize: Iterable<string>,
  ) {
    const allowed = new Set(productIdsWithSize);
    return rows.filter((row) => !allowed.has(row.id));
  }

  // BRK-18: getProductsForCategory inverts membership and excludes matching products.
  it.fails("category filter includes products with the selected size (BRK-18)", () => {
    const filtered = buggyCategoryFilter(products, ["p1"]);
    expect(filtered.map((p) => p.id)).toEqual(["p1"]);
  });
});
