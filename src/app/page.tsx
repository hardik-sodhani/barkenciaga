import Image from "next/image";
import Link from "next/link";
import { getFeaturedCollections, getAllCategories } from "@/lib/products";
import { ProductTile } from "@/components/commerce/product-tile";

export default async function HomePage() {
  const [collections, categories] = await Promise.all([
    getFeaturedCollections(),
    getAllCategories(),
  ]);

  const hero = collections.find((c) => c.slug === "autumn-woofer-26");
  const blackTie = collections.find((c) => c.slug === "black-tie");
  const commuter = collections.find((c) => c.slug === "city-commuter");

  return (
    <div className="min-h-screen bg-[red]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-7 md:min-h-[820px] md:grid-cols-12 md:gap-12 md:px-12 md:py-12">
          <div className="flex min-h-[410px] flex-col justify-end md:col-span-7 md:min-h-0">
            <div className="eyebrow mb-4 text-burgundy">
              AW/26 — Editorial 01
            </div>
            <h1 className="font-display text-[clamp(3.5rem,7.5vw,6.75rem)] leading-[0.92] tracking-[-0.02em]">
              High fashion.
              <br />
              <span className="italic">For dogs.</span>
            </h1>
            <p className="text-body-secondary mt-6 max-w-xl text-sm">
              Couture, accessories, eyewear, and footwear - engineered for the
              discerning dog and the humans who walk them. Hand-finished in
              Milan. Approved by a panel of six studio canines.
            </p>
            <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
              <Link
                href="/collections/autumn-woofer-26"
                className="border border-ink bg-ink px-6 py-3.5 text-[11px] tracking-[0.24em] uppercase !text-bone hover:bg-ink-80"
              >
                Shop Autumn/Woofer &apos;26
              </Link>
              <Link
                href="/account/dogs/new"
                className="border border-ink-20 px-6 py-3.5 text-[11px] tracking-[0.24em] uppercase text-ink hover:border-ink"
              >
                Build a dog profile
              </Link>
            </div>
          </div>
          <div className="relative min-h-[362px] overflow-hidden md:col-span-5 md:min-h-0">
            <Image
              src="/hero/editorial-dog-aw26.webp"
              alt="A long-haired greyhound in a burgundy quilted coat seated on a black studio plinth"
              fill
              preload
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1440px) 40vw, 576px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="border-b border-ink-20 bg-bone-100">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/c/${c.slug}`}
              className="border-r border-ink-20 p-10 text-center last:border-r-0 hover:bg-bone-200"
            >
              <div className="eyebrow mb-2">Shop</div>
              <div className="font-display text-4xl">{c.name}</div>
              <div className="mt-2 text-xs text-ink-60">{c.tagline}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured collection */}
      {hero && (
        <section className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="eyebrow mb-2">The season</div>
              <h2 className="display-lg">{hero.name}</h2>
              <p className="mt-3 max-w-lg text-sm text-ink-60">{hero.tagline}</p>
            </div>
            <Link
              href={`/collections/${hero.slug}`}
              className="text-[11px] tracking-[0.24em] uppercase hover:text-burgundy"
            >
              See all ({hero.products.length}) →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {hero.products.slice(0, 8).map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Editorial split */}
      {blackTie && commuter && (
        <section className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-20 md:grid-cols-2">
          {[blackTie, commuter].map((col) => (
            <div key={col.id} className="border border-ink-20 bg-bone-50 p-8">
              <div className="eyebrow mb-2">{col.season}</div>
              <h3 className="font-display text-4xl">{col.name}</h3>
              <p className="mt-3 max-w-md text-sm text-ink-60">{col.tagline}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {col.products.slice(0, 4).map((p) => (
                  <ProductTile key={p.id} product={p} />
                ))}
              </div>
              <Link
                href={`/collections/${col.slug}`}
                className="mt-6 inline-block text-[11px] tracking-[0.24em] uppercase hover:text-burgundy"
              >
                Shop the edit →
              </Link>
            </div>
          ))}
        </section>
      )}

      {/* Editorial footer */}
      <section className="border-t border-ink-20 bg-ink text-bone">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-24 md:grid-cols-2">
          <div>
            <div className="eyebrow text-bone-300 mb-4">The studio</div>
            <h2 className="display-lg text-bone">
              Designed around the dog, not the human.
            </h2>
          </div>
          <div className="space-y-4 text-sm text-bone/80 md:mt-10">
            <p>
              Barkenciaga is the first house to cut, fit, and photograph every
              garment on its canine-first lasts. Measurements are taken at neck,
              chest, and back. Sizing is reviewed across 18 breeds.
            </p>
            <p>
              Our promise: every piece looks correct, lasts, and survives the
              park.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
