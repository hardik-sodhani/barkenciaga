import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryBySlug,
  getProductsForCategory,
} from "@/lib/products";
import { ProductTile } from "@/components/commerce/product-tile";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
] as const;

// `searchParams` already opts this route into dynamic rendering per-request;
// `force-dynamic` was disabling Partial Prerendering of the static shell for
// no benefit.

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ size?: string; sort?: string }>;
}) {
  const { category: slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const sort = (sp.sort as "featured" | "price-asc" | "price-desc" | "new" | undefined) ?? "featured";
  const size = SIZES.includes(sp.size as (typeof SIZES)[number]) ? sp.size : undefined;
  const products = await getProductsForCategory(category.id, { size, sort });

  const qs = (params: Record<string, string | undefined>) => {
    const merged = { ...sp, ...params };
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v) usp.set(k, v);
    }
    const s = usp.toString();
    return s ? `?${s}` : "";
  };

  return (
    <>
      <section className="border-b border-ink-20">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-2">Category</div>
            <h1 className="display-lg">{category.name}</h1>
            <p className="mt-3 max-w-xl text-sm text-ink-65">{category.heroCopy}</p>
          </div>
          <div className="text-xs text-ink-65">
            {products.length} pieces available
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1400px] gap-10 px-6 py-10">
        <aside className="hidden w-48 flex-shrink-0 md:block">
          <div className="eyebrow mb-3">Size</div>
          <div className="space-y-2 text-sm">
            <Link
              href={`/c/${slug}${qs({ size: undefined })}`}
              className={!size ? "font-medium" : "text-ink-65 hover:text-ink"}
            >
              All sizes
            </Link>
            {SIZES.map((s) => (
              <div key={s}>
                <Link
                  href={`/c/${slug}${qs({ size: s })}`}
                  className={
                    size === s ? "font-medium" : "text-ink-65 hover:text-ink"
                  }
                >
                  {s.toUpperCase()}
                </Link>
              </div>
            ))}
          </div>

          <div className="eyebrow mt-10 mb-3">Sort</div>
          <div className="space-y-2 text-sm">
            {SORTS.map((s) => (
              <div key={s.id}>
                <Link
                  href={`/c/${slug}${qs({ sort: s.id })}`}
                  className={
                    sort === s.id ? "font-medium" : "text-ink-65 hover:text-ink"
                  }
                >
                  {s.label}
                </Link>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="border border-dashed border-ink-20 p-16 text-center">
              <p className="font-display text-3xl">Nothing in this size.</p>
              <p className="mt-3 text-sm text-ink-65">
                Try a different size or{" "}
                <Link className="underline" href={`/c/${slug}`}>
                  clear filters
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {products.map((p) => (
                <ProductTile key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
