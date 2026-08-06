"use client";

import { useEffect, useState } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useVariantSelection, SIZE_LABEL } from "@/components/commerce/variant-selection-context";

export function PdpStickyAddBar() {
  const {
    productName,
    priceCents,
    color,
    size,
    qty,
    activeVariant,
    isSoldOut,
    pending,
    addToCart,
    addButtonEl,
  } = useVariantSelection();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!addButtonEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(addButtonEl);
    return () => observer.disconnect();
  }, [addButtonEl]);

  if (!visible) return null;

  const variantLabel =
    activeVariant && size
      ? `${SIZE_LABEL[size]} / ${color}`
      : null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-ink-20 bg-bone/95 backdrop-blur lg:hidden",
        "pb-[env(safe-area-inset-bottom)]",
      )}
      role="region"
      aria-label="Add to bag"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{productName}</p>
          <div className="flex items-center gap-2 text-xs text-ink-60">
            <span className="tabular-nums">{formatPrice(priceCents * qty)}</span>
            {variantLabel && (
              <>
                <span aria-hidden>·</span>
                <span>{variantLabel}</span>
              </>
            )}
          </div>
        </div>
        <Button
          type="button"
          size="lg"
          disabled={isSoldOut || pending}
          className="shrink-0"
          onClick={() => addToCart()}
        >
          {pending ? "Adding..." : isSoldOut ? "Sold out" : "Add to bag"}
        </Button>
      </div>
    </div>
  );
}
