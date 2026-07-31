export const LOW_STOCK_THRESHOLD = 6;
export const LOW_STOCK_EYEBROW = "Limited quantities";

export function isLowStock(inventory: number): boolean {
  return inventory < LOW_STOCK_THRESHOLD;
}
