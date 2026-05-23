import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/lib/products";
import { ProductTile } from "@/components/commerce/product-tile";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  return (
    <>
      <section className="border-b border-ink-20">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="eyebrow mb-3">{collection.season}</div>
          <h1 className="display-xl">{collection.name}</h1>
          {collection.tagline && (
            <p className="mt-4 max-w-xl text-sm text-ink-65">
              {collection.tagline}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {collection.products.map((p, i) => (
            <ProductTile
              key={p.id}
              product={p}
              large={i === 0}
              eyebrow={i === 0 ? "Editor's pick" : undefined}
              className={i === 0 ? "col-span-2 row-span-2" : undefined}
              sizes={
                i === 0
                  ? "(min-width: 1024px) 50vw, 100vw"
                  : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              }
            />
          ))}
        </div>
      </section>
    </>
  );
}
