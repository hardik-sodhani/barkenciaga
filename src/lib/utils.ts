export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatPriceShort(cents: number) {
  return `$${Math.round(cents / 100).toLocaleString()}`;
}
