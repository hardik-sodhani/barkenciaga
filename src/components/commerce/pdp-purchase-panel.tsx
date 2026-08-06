"use client";

import { VariantSelectionProvider } from "@/components/commerce/variant-selection-context";
import { VariantSelector } from "@/components/commerce/variant-selector";
import { PdpStickyAddBar } from "@/components/commerce/pdp-sticky-add-bar";
import type { Variant } from "@/components/commerce/variant-selection-context";

export function PdpPurchasePanel({
  productName,
  variants,
  priceCents,
  recommendedSize,
  activeDogName,
}: {
  productName: string;
  variants: Variant[];
  priceCents: number;
  recommendedSize?: Variant["size"] | null;
  activeDogName?: string | null;
}) {
  return (
    <VariantSelectionProvider
      productName={productName}
      variants={variants}
      priceCents={priceCents}
      recommendedSize={recommendedSize}
      activeDogName={activeDogName}
    >
      <VariantSelector />
      <PdpStickyAddBar />
    </VariantSelectionProvider>
  );
}
