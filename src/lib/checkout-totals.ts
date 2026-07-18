import { shippingCentsFor, taxCentsFor } from "@/lib/cart";

export type CheckoutTotals = {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

/** Totals shown on cart and checkout preview pages. */
export function computePreviewTotals(subtotalCents: number): CheckoutTotals {
  const shippingCents = shippingCentsFor(subtotalCents);
  const taxCents = taxCentsFor(subtotalCents);
  return {
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
  };
}

/** Totals persisted by checkoutAction when an order is placed. */
export function computePersistedOrderTotals(subtotalCents: number): CheckoutTotals {
  const shippingCents = shippingCentsFor(subtotalCents);
  const taxCents = taxCentsFor(subtotalCents + shippingCents);
  return {
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
  };
}
