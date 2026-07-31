"use client";

import { useMemo, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { ProductVariant } from "@/db/schema";
import { formatPrice } from "@/lib/utils";
import { addToCartAction } from "@/server/actions/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

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
  const colors = useMemo(() => {
    const map = new Map<string, { color: string; colorHex: string }>();
    for (const v of variants) {
      if (!map.has(v.color)) map.set(v.color, { color: v.color, colorHex: v.colorHex });
    }
    return Array.from(map.values());
  }, [variants]);

  const sizesForColor = (color: string) =>
    Array.from(new Set(variants.filter((v) => v.color === color).map((v) => v.size)));

  const [color, setColor] = useState(colors[0]?.color ?? "");
  const availableSizes = useMemo(() => sizesForColor(color), [color, variants]);
  const [size, setSize] = useState<Variant["size"] | null>(
    recommendedSize && availableSizes.includes(recommendedSize)
      ? recommendedSize
      : availableSizes[0] ?? null,
  );
  const [qty, setQty] = useState(1);
  const [pending, setPending] = useState(false);

  const activeVariant = variants.find(
    (v) => v.color === color && v.size === size,
  );
  const inventory = activeVariant?.inventory ?? 0;
  const isSoldOut = !activeVariant || inventory === 0;

  // DEMO-TODO: wire React's useOptimistic() here so the header cart count
  // increments immediately instead of waiting for the server action to
  // complete. See TECH_DEBT.md item 1.
  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeVariant || isSoldOut) return;
    const fd = new FormData();
    fd.set("variantId", activeVariant.id);
    fd.set("quantity", String(qty));
    setPending(true);
    try {
      await addToCartAction(fd);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onAdd} {...stylex.props(styles.form)}>
      <div>
        <div {...stylex.props(commonStyles.eyebrow, styles.sectionLabel)}>
          Color - {color}
        </div>
        <div {...stylex.props(styles.colorOptions)}>
          {colors.map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => {
                setColor(c.color);
                const next = sizesForColor(c.color);
                setSize(
                  recommendedSize && next.includes(recommendedSize)
                    ? recommendedSize
                    : next[0] ?? null,
                );
              }}
              {...stylex.props(
                styles.colorButton,
                color === c.color
                  ? styles.colorButtonActive
                  : styles.colorButtonInactive,
              )}
            >
              <span
                aria-hidden
                {...stylex.props(styles.colorSwatch)}
                style={{ background: c.colorHex }}
              />
              {c.color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div {...stylex.props(commonStyles.eyebrow, styles.sizeLabelRow)}>
          <span>Size</span>
          {recommendedSize && (
            <span {...stylex.props(styles.recommendedCopy)}>
              {activeDogName ? (
                <>
                  <span {...stylex.props(styles.recommendedSize)}>
                    {SIZE_LABEL[recommendedSize]}
                  </span>{" "}
                  recommended for{" "}
                  {activeDogName}
                </>
              ) : (
                <>recommended {SIZE_LABEL[recommendedSize]}</>
              )}
            </span>
          )}
        </div>
        <div {...stylex.props(styles.sizeOptions)}>
          {(["xs", "s", "m", "l", "xl"] as const).map((s) => {
            const available = availableSizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                disabled={!available}
                onClick={() => setSize(s)}
                {...stylex.props(
                  styles.sizeButton,
                  size === s
                    ? styles.sizeButtonActive
                    : available
                      ? styles.sizeButtonAvailable
                      : styles.sizeButtonUnavailable,
                  recommendedSize === s &&
                    size !== s &&
                    styles.sizeButtonRecommended,
                )}
              >
                {SIZE_LABEL[s]}
              </button>
            );
          })}
        </div>
      </div>

      <div {...stylex.props(styles.quantityRow)}>
        <div {...stylex.props(styles.quantityStepper)}>
          <button
            type="button"
            {...stylex.props(styles.stepperButton)}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <div {...stylex.props(styles.qtyValue)}>{qty}</div>
          <button
            type="button"
            {...stylex.props(styles.stepperButton)}
            onClick={() => setQty((q) => Math.min(10, q + 1))}
          >
            +
          </button>
        </div>
        <div {...stylex.props(styles.total)}>
          {formatPrice(priceCents * qty)}
        </div>
      </div>

      <div {...stylex.props(styles.addRow)}>
        <Button
          type="submit"
          size="lg"
          disabled={isSoldOut || pending}
          sx={styles.addButton}
        >
          {pending ? "Adding..." : isSoldOut ? "Sold out" : "Add to bag"}
        </Button>
        {activeVariant && (
          <Badge tone={inventory < 6 ? "burgundy" : "bone"}>
            {inventory < 6 ? `Only ${inventory} left` : `${inventory} in stock`}
          </Badge>
        )}
      </div>
      {activeVariant && (
        <div {...stylex.props(styles.sku)}>
          SKU {activeVariant.sku}
        </div>
      )}
    </form>
  );
}

const styles = stylex.create({
  form: {
    display: "grid",
    gap: "1.5rem",
  },
  sectionLabel: {
    marginBottom: "0.5rem",
  },
  colorOptions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  colorButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    transitionProperty: "border-color",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease",
  },
  colorButtonActive: {
    borderColor: tokens.ink,
  },
  colorButtonInactive: {
    borderColor: tokens.ink20,
    ":hover": {
      borderColor: tokens.ink40,
    },
  },
  colorSwatch: {
    display: "inline-block",
    height: "1rem",
    width: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
  },
  sizeLabelRow: {
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  recommendedCopy: {
    textTransform: "none",
    letterSpacing: 0,
    color: tokens.ink60,
  },
  recommendedSize: {
    color: tokens.burgundy,
  },
  sizeOptions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  sizeButton: {
    width: "3.5rem",
    paddingBlock: "0.75rem",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  sizeButtonActive: {
    backgroundColor: tokens.ink,
    color: tokens.bone,
    borderColor: tokens.ink,
  },
  sizeButtonAvailable: {
    borderColor: tokens.ink20,
    color: tokens.ink,
    ":hover": {
      borderColor: tokens.ink,
    },
  },
  sizeButtonUnavailable: {
    borderColor: tokens.ink20,
    color: tokens.ink65,
    textDecoration: "line-through",
  },
  sizeButtonRecommended: {
    outline: `1px solid ${tokens.burgundy}`,
  },
  quantityRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  quantityStepper: {
    display: "flex",
    alignItems: "center",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
  },
  stepperButton: {
    height: "2.75rem",
    width: "2.75rem",
    fontSize: "1.125rem",
    color: tokens.ink,
    backgroundColor: "transparent",
    border: 0,
    ":hover": {
      backgroundColor: tokens.bone200,
    },
  },
  qtyValue: {
    width: "2.5rem",
    textAlign: "center",
    fontSize: "0.875rem",
    fontVariantNumeric: "tabular-nums",
  },
  total: {
    fontSize: "0.875rem",
    fontVariantNumeric: "tabular-nums",
  },
  addRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  addButton: {
    flex: 1,
  },
  sku: {
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: tokens.ink65,
  },
});
