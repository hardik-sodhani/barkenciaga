/**
 * Documents the SELECT count in getCart's per-line loop (TECH_DEBT.md item 6).
 * Kept pure so we can lock the N+1 contract without a database harness.
 */
export function getCartSelectCountForLineCount(lineCount: number): number {
  if (lineCount <= 0) return lineCount === 0 ? 1 : 0;
  return 1 + lineCount * 2;
}

/** Target shape after collapsing variant + product lookups into one query. */
export function optimalGetCartSelectCountForLineCount(lineCount: number): number {
  if (lineCount <= 0) return lineCount === 0 ? 1 : 0;
  return 2;
}
