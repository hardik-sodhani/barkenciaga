import { shippingCentsFor, taxCentsFor } from "@/lib/cart";

/** Matches cart and checkout page preview math (taxes subtotal only). */
export function checkoutPreviewTotalCents(subtotalCents: number): number {
  const shipping = shippingCentsFor(subtotalCents);
  const tax = taxCentsFor(subtotalCents);
  return subtotalCents + shipping + tax;
}

/** Matches checkoutAction persisted order math (taxes subtotal + shipping). */
export function checkoutPersistedTotalCents(subtotalCents: number): number {
  const shipping = shippingCentsFor(subtotalCents);
  const tax = taxCentsFor(subtotalCents + shipping);
  return subtotalCents + shipping + tax;
}

export function checkoutPreviewTaxCents(subtotalCents: number): number {
  return taxCentsFor(subtotalCents);
}

export function checkoutPersistedTaxCents(subtotalCents: number): number {
  const shipping = shippingCentsFor(subtotalCents);
  return taxCentsFor(subtotalCents + shipping);
}
