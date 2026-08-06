import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug } from "@/lib/products";
import { getActiveDog, recommendSizeForDog } from "@/lib/dogs";
import { PdpPurchasePanel } from "@/components/commerce/pdp-purchase-panel";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const dog = await getActiveDog();
  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size)),
  ) as Array<"xs" | "s" | "m" | "l" | "xl">;
  const recommended = dog
    ? recommendSizeForDog(
        { sizeBucket: dog.sizeBucket },
        availableSizes,
      )
    : null;

  return (
    <>
      {/* DEMO-TODO: surface collection membership here as chips.
          Pull from collection_products and link to /collections/<slug>.
          See TECH_DEBT.md item 4. */}
      <div className="mx-auto max-w-[1400px] px-6 py-6 text-xs text-ink-60">
        <Link href="/">Home</Link> /{" "}
        {product.category && (
          <>
            <Link href={`/c/${product.category.slug}`}>{product.category.name}</Link> /{" "}
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </div>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-28 lg:pb-20 md:grid-cols-12">
        <div className="md:col-span-7">
          {product.imagePath ? (
            <div className="relative aspect-[4/5] overflow-hidden border border-ink-20 bg-bone-50">
              <Image
                src={product.imagePath}
                alt={product.subtitle ? `${product.name}, ${product.subtitle}` : product.name}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority
                className="object-cover"
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
            >
              <div className="absolute inset-0 flex items-end p-10">
                <span className="bg-bone/90 px-3 py-1.5 text-xs font-medium tracking-[0.18em] uppercase text-ink">
                  {product.brandLine} — {product.category?.name}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-4 gap-3">
            {product.variants.slice(0, 4).map((v) => (
              <div
                key={v.id}
                className="aspect-square border border-ink-20"
                style={{ background: v.colorHex }}
                title={`${v.color} / ${v.size.toUpperCase()}`}
                aria-label={`Color ${v.color}, size ${v.size.toUpperCase()}`}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-8">
          <div>
            <div className="eyebrow mb-2">{product.brandLine}</div>
            <h1 className="display-lg leading-tight">{product.name}</h1>
            {product.subtitle && (
              <p className="mt-2 text-sm text-ink-60">{product.subtitle}</p>
            )}
            <div className="mt-6 text-2xl font-display tabular-nums">
              {formatPrice(product.priceCents)}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-ink-80">{product.description}</p>

          {dog && recommended && (
            <div className="flex items-center gap-2">
              <Badge tone="chartreuse">Fit finder</Badge>
              <span className="text-xs text-ink-60">
                Based on {dog.name}&apos;s measurements ({dog.breed}, size{" "}
                {dog.sizeBucket.toUpperCase()}), we recommend{" "}
                <strong>{recommended.toUpperCase()}</strong>.
              </span>
            </div>
          )}

          <PdpPurchasePanel
            productName={product.name}
            variants={product.variants}
            priceCents={product.priceCents}
            recommendedSize={recommended ?? null}
            activeDogName={dog?.name ?? null}
          />

          {product.editorialCopy && (
            <div className="border-t border-ink-20 pt-6">
              <div className="eyebrow mb-2">From the studio</div>
              <p className="text-sm italic text-ink-80">{product.editorialCopy}</p>
            </div>
          )}

          {product.careCopy && (
            <div className="border-t border-ink-20 pt-6">
              <div className="eyebrow mb-2">Care</div>
              <p className="text-sm text-ink-60">{product.careCopy}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
