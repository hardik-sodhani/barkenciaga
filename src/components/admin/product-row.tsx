"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

/**
 * Stateful product accordion for /admin. Using local state (instead of
 * <details>) means the expanded panel stays open across the re-renders
 * triggered by `revalidatePath` after each variant/product save.
 */
export function AdminProductRow({
  id,
  name,
  slug,
  categoryName,
  variantCount,
  priceCents,
  children,
}: {
  id: string;
  name: string;
  slug: string;
  categoryName: string | undefined;
  variantCount: number;
  priceCents: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border border-ink-20 bg-bone-50">
      <div className="flex items-center justify-between gap-4 p-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex flex-1 items-center justify-between gap-4 text-left"
        >
          <span>
            <span className="font-display text-xl block">{name}</span>
            <span className="text-xs text-ink-65 block">
              {categoryName} · {variantCount} variants · {formatPrice(priceCents)}
            </span>
          </span>
          <span
            aria-hidden
            className={cn(
              "ml-4 inline-block text-ink-65 transition-transform",
              open && "rotate-180",
            )}
          >
            ▾
          </span>
        </button>
        <Link
          href={`/p/${slug}`}
          className="text-[11px] tracking-[0.2em] uppercase text-ink-65 hover:text-ink"
        >
          View PDP →
        </Link>
      </div>
      <div
        id={panelId}
        hidden={!open}
        // Keep the panel mounted so per-row forms retain their own
        // React state across collapses; we just hide it visually.
      >
        <div className="border-t border-ink-20 p-5">{children}</div>
      </div>
      <span className="sr-only">Product id {id}</span>
    </div>
  );
}
