import { searchProducts } from "@/lib/products";
import * as stylex from "@stylexjs/stylex";
import { ProductTile } from "@/components/commerce/product-tile";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

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
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(commonStyles.eyebrow, styles.eyebrow)}>Search</div>
      <h1 {...stylex.props(commonStyles.displayLg)}>Find a piece.</h1>

      <form {...stylex.props(styles.searchForm)}>
        <input
          type="search"
          name="q"
          defaultValue={query}
          autoFocus
          placeholder="Try &ldquo;quilted&rdquo;, &ldquo;rain&rdquo;, &ldquo;bow tie&rdquo;"
          {...stylex.props(styles.searchInput)}
        />
      </form>

      {query && (
        <div {...stylex.props(styles.resultCount)}>
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;
          {query}&rdquo;
        </div>
      )}

      <div {...stylex.props(styles.resultsGrid)}>
        {results.map((p) => (
          <ProductTile key={p.id} product={p} />
        ))}
      </div>

      {query && results.length === 0 && (
        <div {...stylex.props(styles.emptyState)}>
          <p {...stylex.props(styles.emptyTitle)}>No match.</p>
          <p {...stylex.props(styles.emptyCopy)}>
            Try a shorter, simpler term.
          </p>
        </div>
      )}
    </section>
  );
}

const styles = stylex.create({
  container: {
    marginInline: "auto",
    maxWidth: "1400px",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
  },
  eyebrow: {
    marginBottom: "0.5rem",
  },
  searchForm: {
    marginTop: "2rem",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    paddingBottom: "0.75rem",
  },
  searchInput: {
    width: "100%",
    backgroundColor: "transparent",
    fontFamily: tokens.fontDisplay,
    fontSize: "1.875rem",
    outline: "none",
    border: 0,
    "::placeholder": {
      color: tokens.ink65,
    },
  },
  resultCount: {
    marginTop: "1rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  resultsGrid: {
    marginTop: "2.5rem",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  emptyState: {
    marginTop: "3rem",
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: tokens.ink20,
    padding: "3rem",
    textAlign: "center",
  },
  emptyTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.875rem",
  },
  emptyCopy: {
    marginTop: "0.75rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
});
