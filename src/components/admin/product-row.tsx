"use client";

import { useCallback, useId, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

const STORAGE_KEY = "barkenciaga:admin:open-products";
const STORAGE_EVENT = "barkenciaga:admin:open-products:changed";

function readOpenSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function writeOpenSet(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // sessionStorage may be unavailable (private mode, storage quota) — degrade gracefully.
  }
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STORAGE_EVENT, cb);
  return () => window.removeEventListener(STORAGE_EVENT, cb);
}

/**
 * Stateful product accordion for /admin. Open state is mirrored to
 * sessionStorage so it survives the route refresh that follows a successful
 * server action. (The native `<details>` element, and even a plain React
 * useState, both reset to "closed" when the action's revalidation re-renders
 * the row after Save.)
 *
 * useSyncExternalStore lets us read from sessionStorage without setState-
 * in-effect, and the SSR snapshot is always `false` to avoid hydration
 * mismatches.
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
  const open = useSyncExternalStore(
    subscribe,
    useCallback(() => readOpenSet().has(id), [id]),
    () => false,
  );
  const panelId = useId();

  const toggle = useCallback(() => {
    const set = readOpenSet();
    if (set.has(id)) set.delete(id);
    else set.add(id);
    writeOpenSet(set);
  }, [id]);

  return (
    <div className="border border-ink-20 bg-bone-50">
      <div className="flex items-center justify-between gap-4 p-5">
        <button
          type="button"
          onClick={toggle}
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
      <div id={panelId} hidden={!open}>
        <div className="border-t border-ink-20 p-5">{children}</div>
      </div>
    </div>
  );
}
