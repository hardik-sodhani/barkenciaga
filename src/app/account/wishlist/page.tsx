import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getWishlistForUser } from "@/lib/wishlist";
import { removeFromWishlistAction } from "@/server/actions/wishlist";
import { formatPrice } from "@/lib/utils";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");
  const wishlist = await getWishlistForUser(session.userId);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow mb-2">Account</div>
          <h1 className="display-lg">Saved for later</h1>
        </div>
        <Link
          href="/account"
          className="text-[11px] tracking-[0.24em] uppercase text-ink-60 hover:text-ink"
        >
          Back to account
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="mt-10 border border-dashed border-ink-20 bg-bone-50 p-12 text-center">
          <p className="font-display text-3xl">Nothing saved yet.</p>
          <p className="mt-3 text-sm text-ink-60">
            Bookmark pieces from any product page and they&apos;ll appear here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block border border-ink px-6 py-3 text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-bone"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {wishlist.map((product) => (
            <li key={product.id} className="border border-ink-20 bg-bone-50 p-4">
              <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <Link href={`/p/${product.slug}`} className="group block">
                  {product.imagePath ? (
                    <div className="relative aspect-[4/5] overflow-hidden border border-ink-20 bg-bone-100">
                      <Image
                        src={product.imagePath}
                        alt={product.subtitle ? `${product.name}, ${product.subtitle}` : product.name}
                        fill
                        sizes="180px"
                        className="object-cover transition-transform group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div
                      className="product-tile-gradient relative aspect-[4/5] border border-ink-20"
                      style={
                        {
                          ["--tile-a" as string]: product.basePalette.a,
                          ["--tile-b" as string]: product.basePalette.b,
                        } as React.CSSProperties
                      }
                    />
                  )}
                </Link>

                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="eyebrow mb-1">{product.brandLine}</div>
                    <Link href={`/p/${product.slug}`} className="font-display text-2xl hover:text-burgundy">
                      {product.name}
                    </Link>
                    {product.subtitle && (
                      <p className="mt-1 text-sm text-ink-60">{product.subtitle}</p>
                    )}
                    <div className="mt-4 text-lg tabular-nums">{formatPrice(product.priceCents)}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/p/${product.slug}`}
                      className="text-[11px] tracking-[0.2em] uppercase text-ink-65 hover:text-ink"
                    >
                      View product
                    </Link>
                    <form action={removeFromWishlistAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button
                        type="submit"
                        className="text-[11px] tracking-[0.2em] uppercase text-ink-65 hover:text-danger"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
