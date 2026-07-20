import { describe, expect, it, vi } from "vitest";
import { filterProductsWithSizeVariant } from "@/lib/product-filters";
import { getProductsForCategory } from "@/lib/products";

const { ensureDbReadyMock, selectMock } = vi.hoisted(() => ({
  ensureDbReadyMock: vi.fn(),
  selectMock: vi.fn(),
}));

vi.mock("@/db", () => ({ db: { select: selectMock } }));
vi.mock("@/db/bootstrap", () => ({ ensureDbReady: ensureDbReadyMock }));

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
  // BRK-18: getProductsForCategory inverts membership and excludes matching products.
  it.fails("category filter includes products with the selected size (BRK-18)", async () => {
    selectMock
      .mockReturnValueOnce({
        from: () => ({
          where: () => ({ orderBy: async () => products }),
        }),
      })
      .mockReturnValueOnce({
        from: () => ({
          where: async () => [{ productId: "p1" }],
        }),
      });

    const filtered = await getProductsForCategory("category-1", { size: "m" });
    expect(filtered.map((p) => p.id)).toEqual(["p1"]);
  });
});
