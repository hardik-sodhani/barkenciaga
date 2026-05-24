"use client";

import { startTransition, useActionState, useMemo, useState } from "react";
import type { ProductVariant } from "@/db/schema";
import { cn, formatPrice } from "@/lib/utils";
import { addToCartAction, type AddToCartState } from "@/server/actions/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHeaderState } from "@/components/session-context";

type Variant = Pick<
  ProductVariant,
  "id" | "size" | "color" | "colorHex" | "inventory" | "sku"
>;

const SIZE_LABEL: Record<Variant["size"], string> = {
  xs: "XS",
  s: "S",
  m: "M",
  l: "L",
  xl: "XL",
};

const ALL_SIZES = ["xs", "s", "m", "l", "xl"] as const;
const INITIAL_STATE: AddToCartState = { error: null };

export function VariantSelector({
  variants,
  priceCents,
  recommendedSize,
  activeDogName,
}: {
  variants: Variant[];
  priceCents: number;
  recommendedSize?: Variant["size"] | null;
  activeDogName?: string | null;
}) {
  const { bumpCart } = useHeaderState();

  const colors = useMemo(() => {
    const map = new Map<string, { color: string; colorHex: string }>();
    for (const v of variants) {
      if (!map.has(v.color)) {
        map.set(v.color, { color: v.color, colorHex: v.colorHex });
      }
    }
    return Array.from(map.values());
  }, [variants]);

  const sizesByColor = useMemo(() => {
    const map = new Map<string, Variant["size"][]>();
    for (const v of variants) {
      const existing = map.get(v.color);
      if (existing) {
        if (!existing.includes(v.size)) existing.push(v.size);
      } else {
        map.set(v.color, [v.size]);
      }
    }
    return map;
  }, [variants]);

  const [color, setColor] = useState(colors[0]?.color ?? "");
  const availableSizes = sizesByColor.get(color) ?? [];
  const [size, setSize] = useState<Variant["size"] | null>(
    recommendedSize && availableSizes.includes(recommendedSize)
      ? recommendedSize
      : (availableSizes[0] ?? null),
  );
  const [qty, setQty] = useState(1);

  const activeVariant = variants.find(
    (v) => v.color === color && v.size === size,
  );
  const inventory = activeVariant?.inventory ?? 0;
  const isSoldOut = !activeVariant || inventory === 0;

  // useActionState wraps the server action so the form's `action` prop stays
  // bound to a server function reference. That means the form still submits
  // without JS (Next maps server actions to their POST endpoint at build
  // time). With JS, the optimistic cart bump fires in `onSubmit` before the
  // server roundtrip lands.
  const [state, formAction, pending] = useActionState<AddToCartState, FormData>(
    addToCartAction,
    INITIAL_STATE,
  );

  const onSubmit = () => {
    if (!activeVariant || isSoldOut) return;
    startTransition(() => bumpCart(qty));
  };

  return (
    <form action={formAction} onSubmit={onSubmit} className="space-y-6">
      <input
        type="hidden"
        name="variantId"
        value={activeVariant?.id ?? ""}
      />
      <input type="hidden" name="quantity" value={qty} />

      <div>
        <div className="eyebrow mb-2">Color - {color}</div>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => {
                setColor(c.color);
                const next = sizesByColor.get(c.color) ?? [];
                setSize(
                  recommendedSize && next.includes(recommendedSize)
                    ? recommendedSize
                    : (next[0] ?? null),
                );
              }}
              aria-pressed={color === c.color}
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
            <span className="normal-case tracking-normal text-ink-65">
              {activeDogName ? (
                <>
                  <span className="text-burgundy">
                    {SIZE_LABEL[recommendedSize]}
                  </span>{" "}
                  recommended for {activeDogName}
                </>
              ) : (
                <>recommended {SIZE_LABEL[recommendedSize]}</>
              )}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => {
            const available = availableSizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                disabled={!available}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "w-14 py-3 text-xs tracking-widest uppercase border",
                  size === s
                    ? "bg-ink text-bone border-ink"
                    : available
                      ? "border-ink-20 text-ink hover:border-ink"
                      : "border-ink-20 text-ink-65 line-through",
                  recommendedSize === s &&
                    size !== s &&
                    "outline outline-1 outline-burgundy",
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
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="h-11 w-11 text-lg text-ink hover:bg-bone-200 disabled:cursor-not-allowed disabled:text-ink-40 disabled:hover:bg-transparent"
          >
            -
          </button>
          <div
            aria-live="polite"
            aria-label={`Quantity: ${qty}`}
            className="w-10 text-center text-sm tabular-nums"
          >
            {qty}
          </div>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            disabled={qty >= 10}
            aria-label="Increase quantity"
            className="h-11 w-11 text-lg text-ink hover:bg-bone-200 disabled:cursor-not-allowed disabled:text-ink-40 disabled:hover:bg-transparent"
          >
            +
          </button>
        </div>
        <div className="text-sm tabular-nums">
          {formatPrice(priceCents * qty)}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={isSoldOut || pending}
          className="flex-1"
        >
          {pending ? "Adding..." : isSoldOut ? "Sold out" : "Add to bag"}
        </Button>
        {activeVariant && (
          <Badge tone={inventory < 6 ? "burgundy" : "bone"}>
            {inventory < 6
              ? `Only ${inventory} left`
              : `${inventory} in stock`}
          </Badge>
        )}
      </div>

      {state.error && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      {activeVariant && (
        <div className="text-[11px] tracking-[0.18em] uppercase text-ink-65">
          SKU {activeVariant.sku}
        </div>
      )}
    </form>
  );
}
