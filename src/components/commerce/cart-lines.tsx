import Link from "next/link";
import Image from "next/image";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import {
  updateCartItemAction,
  removeCartItemAction,
} from "@/server/actions/cart";

export function CartLines({ lines }: { lines: CartLine[] }) {
  if (lines.length === 0) {
    return (
      <div className="border border-dashed border-ink-20 p-12 text-center">
        <div className="eyebrow mb-3">The bag</div>
        <p className="font-display text-3xl">Empty and waiting.</p>
        <p className="mt-3 text-sm text-ink-60">
          Start with the{" "}
          <Link className="underline underline-offset-4" href="/collections/autumn-woofer-26">
            Autumn/Woofer &apos;26
          </Link>{" "}
          edit.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink-20 border-y border-ink-20">
      {lines.map((line) => (
        <li key={line.id} className="flex gap-4 py-6">
          {line.product.imagePath ? (
            <Link
              href={`/p/${line.product.slug}`}
              className="relative aspect-[4/5] w-20 flex-shrink-0 overflow-hidden border border-ink-20 bg-bone-50 md:w-24"
            >
              <Image
                src={line.product.imagePath}
                alt={line.product.subtitle ? `${line.product.name}, ${line.product.subtitle}` : line.product.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>
          ) : (
            <div
              className="product-tile-gradient relative flex aspect-[4/5] w-20 flex-shrink-0 items-end border border-ink-20 p-3 md:w-24"
              style={
                {
                  ["--tile-a" as string]: line.product.basePalette.a,
                  ["--tile-b" as string]: line.product.basePalette.b,
                } as React.CSSProperties
              }
            >
              <span className="bg-bone/90 px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] uppercase text-ink">
                {line.product.name.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
          )}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/p/${line.product.slug}`}
                  className="font-medium hover:text-burgundy"
                >
                  {line.product.name}
                </Link>
                <div className="tabular-nums">{formatPrice(line.lineTotalCents)}</div>
              </div>
              <div className="mt-1 text-xs text-ink-60">
                {line.variant.color} / Size {line.variant.size.toUpperCase()}
              </div>
              <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-ink-65">
                SKU {line.variant.sku}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <form action={updateCartItemAction} className="flex items-center border border-ink-20">
                <input type="hidden" name="itemId" value={line.id} />
                <button
                  type="submit"
                  name="quantity"
                  value={line.quantity - 1}
                  className="h-9 w-9 hover:bg-bone-200"
                  aria-label="Decrease"
                >
                  -
                </button>
                <div className="w-8 text-center text-sm tabular-nums">{line.quantity}</div>
                <button
                  type="submit"
                  name="quantity"
                  value={line.quantity + 1}
                  className="h-9 w-9 hover:bg-bone-200"
                  aria-label="Increase"
                >
                  +
                </button>
              </form>
              <form action={removeCartItemAction}>
                <input type="hidden" name="itemId" value={line.id} />
                <button
                  type="submit"
                  className="text-[11px] tracking-[0.2em] uppercase text-ink-65 hover:text-burgundy"
                >
                  Remove
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
