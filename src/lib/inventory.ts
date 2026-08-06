export const LOW_STOCK_THRESHOLD = 6;

export const LIMITED_QUANTITIES_LABEL = "Limited quantities";

export function isLowStock(inventory: number): boolean {
  return inventory < LOW_STOCK_THRESHOLD;
}

export function lowStockBadgeLabel(inventory: number): string {
  return `Only ${inventory} left`;
}
