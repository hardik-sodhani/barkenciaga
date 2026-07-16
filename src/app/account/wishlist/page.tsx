import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { getWishlistForUser } from "@/lib/wishlist";
import { formatPrice } from "@/lib/utils";
import {
  moveWishlistToCartAction,
  removeFromWishlistAction,
} from "@/server/actions/wishlist";
import { Button } from "@/components/ui/button";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in?next=/account/wishlist");

  const lines = await getWishlistForUser(session.userId);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="eyebrow mb-2">Account</div>
      <h1 className="display-lg">Saved for later.</h1>
      <p className="mt-4 max-w-xl text-sm text-ink-60">
        Pieces you bookmarked from the studio. Move them to your bag when you are
        ready to check out.
      </p>

      {lines.length === 0 ? (
        <div className="mt-12 border border-dashed border-ink-20 p-12 text-center">
          <p className="font-display text-3xl">Nothing saved yet.</p>
          <p className="mt-3 text-sm text-ink-60">
            Browse the{" "}
            <Link
              className="underline underline-offset-4"
              href="/collections/autumn-woofer-26"
            >
              Autumn/Woofer &apos;26
            </Link>{" "}
            edit and tap the heart on any piece you love.
          </p>
        </div>
      ) : (
        <ul className="mt-12 divide-y divide-ink-20 border-y border-ink-20">
          {lines.map((line) => {
            const soldOut = line.variant.inventory === 0;
            return (
              <li key={line.id} className="flex gap-4 py-6">
                {line.product.imagePath ? (
                  <Link
                    href={`/p/${line.product.slug}`}
                    className="relative aspect-[4/5] w-20 flex-shrink-0 overflow-hidden border border-ink-20 bg-bone-50 md:w-24"
                  >
                    <Image
                      src={line.product.imagePath}
                      alt={
                        line.product.subtitle
                          ? `${line.product.name}, ${line.product.subtitle}`
                          : line.product.name
                      }
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
                <div className="flex flex-1 flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <Link
                      href={`/p/${line.product.slug}`}
                      className="font-display text-xl hover:text-burgundy"
                    >
                      {line.product.name}
                    </Link>
                    <div className="mt-1 text-xs text-ink-60">
                      {line.variant.color} / {line.variant.size.toUpperCase()} · SKU{" "}
                      {line.variant.sku}
                    </div>
                    <div className="mt-2 tabular-nums text-sm">
                      {formatPrice(line.unitPriceCents)}
                    </div>
                    {soldOut && (
                      <div className="mt-2 text-xs uppercase tracking-widest text-burgundy">
                        Sold out
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form action={moveWishlistToCartAction}>
                      <input type="hidden" name="variantId" value={line.variantId} />
                      <Button type="submit" size="sm" disabled={soldOut}>
                        Move to bag
                      </Button>
                    </form>
                    <form action={removeFromWishlistAction}>
                      <input type="hidden" name="variantId" value={line.variantId} />
                      <Button type="submit" variant="outline" size="sm">
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-8">
        <Link
          href="/account"
          className="text-[11px] tracking-[0.24em] uppercase text-ink-60 hover:text-ink"
        >
          ← Back to account
        </Link>
      </div>
    </section>
  );
}
