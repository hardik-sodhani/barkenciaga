"use client";

import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useVariantSelection,
  SIZE_LABEL,
} from "@/components/commerce/variant-selection-context";

export function VariantSelector() {
  const {
    recommendedSize,
    activeDogName,
    colors,
    color,
    setColor,
    size,
    setSize,
    qty,
    setQty,
    availableSizes,
    priceCents,
    activeVariant,
    inventory,
    isSoldOut,
    pending,
    addToCart,
    addButtonRef,
  } = useVariantSelection();

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await addToCart();
  }

  return (
    <form onSubmit={onAdd} className="space-y-6">
      <div>
        <div className="eyebrow mb-2">Color - {color}</div>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => setColor(c.color)}
              className={cn(
                "flex items-center gap-2 border px-3 py-2 text-xs tracking-widest uppercase transition-colors",
                color === c.color
                  ? "border-ink"
                  : "border-ink-20 hover:border-ink-40",
              )}
            >
              <span
                aria-hidden
                className="inline-block h-4 w-4 border border-ink-20"
                style={{ background: c.colorHex }}
              />
              {c.color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="eyebrow mb-2 flex items-center gap-2">
          <span>Size</span>
          {recommendedSize && (
            <span className="normal-case tracking-normal text-ink-60">
              {activeDogName ? (
                <>
                  <span className="text-burgundy">{SIZE_LABEL[recommendedSize]}</span> recommended for{" "}
                  {activeDogName}
                </>
              ) : (
                <>recommended {SIZE_LABEL[recommendedSize]}</>
              )}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["xs", "s", "m", "l", "xl"] as const).map((s) => {
            const available = availableSizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                disabled={!available}
                onClick={() => setSize(s)}
                className={cn(
                  "w-14 py-3 text-xs tracking-widest uppercase border",
                  size === s
                    ? "bg-ink text-bone border-ink"
                    : available
                      ? "border-ink-20 text-ink hover:border-ink"
                      : "border-ink-20 text-ink-65 line-through",
                  recommendedSize === s && size !== s && "outline outline-1 outline-burgundy",
                )}
              >
                {SIZE_LABEL[s]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-ink-20">
          <button
            type="button"
            className="h-11 w-11 text-lg text-ink hover:bg-bone-200"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <div className="w-10 text-center text-sm tabular-nums">{qty}</div>
          <button
            type="button"
            className="h-11 w-11 text-lg text-ink hover:bg-bone-200"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
          >
            +
          </button>
        </div>
        <div className="text-sm tabular-nums">
          {formatPrice(priceCents * qty)}
        </div>
      </div>

      <div ref={addButtonRef} className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={isSoldOut || pending} className="flex-1">
          {pending ? "Adding..." : isSoldOut ? "Sold out" : "Add to bag"}
        </Button>
        {activeVariant && (
          <Badge tone={inventory < 6 ? "burgundy" : "bone"}>
            {inventory < 6 ? `Only ${inventory} left` : `${inventory} in stock`}
          </Badge>
        )}
      </div>
      {activeVariant && (
        <div className="text-[11px] tracking-[0.18em] uppercase text-ink-65">
          SKU {activeVariant.sku}
        </div>
      )}
    </form>
  );
}
