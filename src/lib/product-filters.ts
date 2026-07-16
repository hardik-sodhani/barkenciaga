/**
 * Pure helpers for category product filtering (testable without DB).
 */
export function filterProductsWithSizeVariant<T extends { id: string }>(
  products: T[],
  productIdsWithSize: Iterable<string>,
): T[] {
  const allowed = new Set(productIdsWithSize);
  return products.filter((product) => allowed.has(product.id));
}
