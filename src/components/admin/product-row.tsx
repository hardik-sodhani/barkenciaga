"use client";

import { useCallback, useId, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

const PARAM = "open";

function parseOpen(value: string | null): Set<string> {
  if (!value) return new Set();
  return new Set(value.split(",").filter(Boolean));
}

/**
 * Stateful product accordion for /admin.
 *
 * Open state is stored in the `?open=id1,id2` search param instead of local
 * React state. The Next 16 server action that runs on Save triggers a router
 * refresh that re-renders this client subtree, which resets useState; the
 * URL, by contrast, is preserved across the refresh. As a bonus, the
 * expanded state survives a hard refresh and is shareable / bookmarkable.
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const panelId = useId();

  const open = parseOpen(searchParams.get(PARAM)).has(id);

  const toggle = useCallback(() => {
    const current = parseOpen(searchParams.get(PARAM));
    if (current.has(id)) current.delete(id);
    else current.add(id);
    const params = new URLSearchParams(searchParams.toString());
    if (current.size === 0) params.delete(PARAM);
    else params.set(PARAM, [...current].join(","));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [id, searchParams, router, pathname]);

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
