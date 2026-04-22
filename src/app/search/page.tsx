import { searchProducts } from "@/lib/products";
import { ProductTile } from "@/components/commerce/product-tile";

// DEMO-TODO: results are hard-capped at 20 with no pagination or cursor.
// Add ?limit= / ?cursor= (or offset) and a "Load more" button. See
// TECH_DEBT.md item 3.

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchProducts(query) : [];

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16">
      <div className="eyebrow mb-2">Search</div>
      <h1 className="display-lg">Find a piece.</h1>

      <form className="mt-8 border-b border-ink-20 pb-3">
        <input
          type="search"
          name="q"
          defaultValue={query}
          autoFocus
          placeholder="Try &ldquo;quilted&rdquo;, &ldquo;rain&rdquo;, &ldquo;bow tie&rdquo;"
          className="w-full bg-transparent font-display text-3xl outline-none placeholder:text-ink-65"
        />
      </form>

      {query && (
        <div className="mt-4 text-xs text-ink-60">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;
          {query}&rdquo;
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {results.map((p) => (
          <ProductTile key={p.id} product={p} />
        ))}
      </div>

      {query && results.length === 0 && (
        <div className="mt-12 border border-dashed border-ink-20 p-12 text-center">
          <p className="font-display text-3xl">No match.</p>
          <p className="mt-3 text-sm text-ink-60">
            Try a shorter, simpler term.
          </p>
        </div>
      )}
    </section>
  );
}
