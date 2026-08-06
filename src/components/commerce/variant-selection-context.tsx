"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type RefCallback,
} from "react";
import type { ProductVariant } from "@/db/schema";
import { addToCartAction } from "@/server/actions/cart";

export type Variant = Pick<
  ProductVariant,
  "id" | "size" | "color" | "colorHex" | "inventory" | "sku"
>;

export const SIZE_LABEL: Record<Variant["size"], string> = {
  xs: "XS",
  s: "S",
  m: "M",
  l: "L",
  xl: "XL",
};

type VariantSelectionContextValue = {
  productName: string;
  priceCents: number;
  recommendedSize?: Variant["size"] | null;
  activeDogName?: string | null;
  variants: Variant[];
  colors: Array<{ color: string; colorHex: string }>;
  color: string;
  setColor: (color: string) => void;
  size: Variant["size"] | null;
  setSize: (size: Variant["size"] | null) => void;
  qty: number;
  setQty: (qty: number | ((q: number) => number)) => void;
  availableSizes: Variant["size"][];
  activeVariant: Variant | undefined;
  inventory: number;
  isSoldOut: boolean;
  pending: boolean;
  addToCart: () => Promise<void>;
  addButtonRef: RefCallback<HTMLDivElement>;
  addButtonEl: HTMLDivElement | null;
};

const VariantSelectionContext = createContext<VariantSelectionContextValue | null>(
  null,
);

export function useVariantSelection() {
  const ctx = useContext(VariantSelectionContext);
  if (!ctx) {
    throw new Error("useVariantSelection must be used within VariantSelectionProvider");
  }
  return ctx;
}

export function VariantSelectionProvider({
  productName,
  variants,
  priceCents,
  recommendedSize,
  activeDogName,
  children,
}: {
  productName: string;
  variants: Variant[];
  priceCents: number;
  recommendedSize?: Variant["size"] | null;
  activeDogName?: string | null;
  children: React.ReactNode;
}) {
  const [addButtonEl, setAddButtonEl] = useState<HTMLDivElement | null>(null);
  const addButtonRef = useCallback((node: HTMLDivElement | null) => {
    setAddButtonEl(node);
  }, []);

  const colors = useMemo(() => {
    const map = new Map<string, { color: string; colorHex: string }>();
    for (const v of variants) {
      if (!map.has(v.color)) map.set(v.color, { color: v.color, colorHex: v.colorHex });
    }
    return Array.from(map.values());
  }, [variants]);

  const sizesForColor = useCallback(
    (colorName: string) =>
      Array.from(
        new Set(variants.filter((v) => v.color === colorName).map((v) => v.size)),
      ),
    [variants],
  );

  const [color, setColorState] = useState(colors[0]?.color ?? "");
  const availableSizes = useMemo(() => sizesForColor(color), [color, sizesForColor]);
  const [size, setSizeState] = useState<Variant["size"] | null>(
    recommendedSize && sizesForColor(colors[0]?.color ?? "").includes(recommendedSize)
      ? recommendedSize
      : sizesForColor(colors[0]?.color ?? "")[0] ?? null,
  );
  const [qty, setQty] = useState(1);
  const [pending, setPending] = useState(false);

  const setColor = useCallback(
    (nextColor: string) => {
      setColorState(nextColor);
      const next = sizesForColor(nextColor);
      setSizeState(
        recommendedSize && next.includes(recommendedSize)
          ? recommendedSize
          : next[0] ?? null,
      );
    },
    [recommendedSize, sizesForColor],
  );

  const activeVariant = variants.find((v) => v.color === color && v.size === size);
  const inventory = activeVariant?.inventory ?? 0;
  const isSoldOut = !activeVariant || inventory === 0;

  const addToCart = useCallback(async () => {
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
  }, [activeVariant, isSoldOut, qty]);

  const value: VariantSelectionContextValue = {
    productName,
    priceCents,
    recommendedSize,
    activeDogName,
    variants,
    colors,
    color,
    setColor,
    size,
    setSize: setSizeState,
    qty,
    setQty,
    availableSizes,
    activeVariant,
    inventory,
    isSoldOut,
    pending,
    addToCart,
    addButtonRef,
    addButtonEl,
  };

  return (
    <VariantSelectionContext.Provider value={value}>
      {children}
    </VariantSelectionContext.Provider>
  );
}
