/**
 * Documents the SELECT count contract for getCart().
 * TECH_DEBT item 6: the current loop issues one query per variant and product.
 */

export type CartQueryPhase = "no-session" | "empty-cart" | "loaded";

export function getCartQueryPhase(
  hasCartId: boolean,
  lineCount: number,
): CartQueryPhase {
  if (!hasCartId) return "no-session";
  if (lineCount === 0) return "empty-cart";
  return "loaded";
}

/** Current getCart() SELECT count for a cart that already has line items. */
export function getCartSelectCountForLoadedCart(lineCount: number): number {
  return 1 + 2 * lineCount;
}

/** Target shape after collapsing the N+1 loop into a single relational query. */
export function getCartSelectCountIdeal(lineCount: number): number {
  if (lineCount === 0) return 1;
  return 1;
}
