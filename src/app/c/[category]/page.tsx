import { notFound } from "next/navigation";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import {
  getCategoryBySlug,
  getProductsForCategory,
} from "@/lib/products";
import { ProductTile } from "@/components/commerce/product-tile";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
] as const;

export const dynamic = "force-dynamic";

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
      <section {...stylex.props(styles.heroSection)}>
        <div {...stylex.props(styles.heroContainer)}>
          <div>
            <div {...stylex.props(commonStyles.eyebrow, styles.eyebrow)}>
              Category
            </div>
            <h1 {...stylex.props(commonStyles.displayLg)}>{category.name}</h1>
            <p {...stylex.props(styles.heroCopy)}>{category.heroCopy}</p>
          </div>
          <div {...stylex.props(styles.heroMeta)}>
            {products.length} pieces available
          </div>
        </div>
      </section>

      <section {...stylex.props(styles.contentSection)}>
        <aside {...stylex.props(styles.filtersAside)}>
          <div {...stylex.props(commonStyles.eyebrow, styles.mb3)}>Size</div>
          <div {...stylex.props(styles.filterList)}>
            <Link
              href={`/c/${slug}${qs({ size: undefined })}`}
              {...stylex.props(!size ? styles.filterActive : styles.filterInactive)}
            >
              All sizes
            </Link>
            {SIZES.map((s) => (
              <div key={s}>
                <Link
                  href={`/c/${slug}${qs({ size: s })}`}
                  {...stylex.props(size === s ? styles.filterActive : styles.filterInactive)}
                >
                  {s.toUpperCase()}
                </Link>
              </div>
            ))}
          </div>

          <div {...stylex.props(commonStyles.eyebrow, styles.sortEyebrow)}>Sort</div>
          <div {...stylex.props(styles.filterList)}>
            {SORTS.map((s) => (
              <div key={s.id}>
                <Link
                  href={`/c/${slug}${qs({ sort: s.id })}`}
                  {...stylex.props(sort === s.id ? styles.filterActive : styles.filterInactive)}
                >
                  {s.label}
                </Link>
              </div>
            ))}
          </div>
        </aside>

        <div {...stylex.props(styles.productsWrap)}>
          {products.length === 0 ? (
            <div {...stylex.props(styles.emptyState)}>
              <p {...stylex.props(styles.emptyTitle)}>Nothing in this size.</p>
              <p {...stylex.props(styles.emptyCopy)}>
                Try a different size or{" "}
                <Link {...stylex.props(styles.underlineLink)} href={`/c/${slug}`}>
                  clear filters
                </Link>
                .
              </p>
            </div>
          ) : (
            <div {...stylex.props(styles.productsGrid)}>
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

const styles = stylex.create({
  heroSection: {
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
  },
  heroContainer: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
    "@media (min-width: 768px)": {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
  },
  eyebrow: { marginBottom: "0.5rem" },
  heroCopy: {
    marginTop: "0.75rem",
    maxWidth: "36rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  heroMeta: {
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  contentSection: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "flex",
    gap: "2.5rem",
    paddingInline: "1.5rem",
    paddingBlock: "2.5rem",
  },
  filtersAside: {
    display: "none",
    width: "12rem",
    flexShrink: 0,
    "@media (min-width: 768px)": {
      display: "block",
    },
  },
  mb3: { marginBottom: "0.75rem" },
  sortEyebrow: {
    marginTop: "2.5rem",
    marginBottom: "0.75rem",
  },
  filterList: {
    display: "grid",
    gap: "0.5rem",
    fontSize: "0.875rem",
  },
  filterActive: {
    fontWeight: 500,
  },
  filterInactive: {
    color: tokens.ink60,
    ":hover": {
      color: tokens.ink,
    },
  },
  productsWrap: {
    flex: 1,
  },
  emptyState: {
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: tokens.ink20,
    padding: "4rem",
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
  underlineLink: {
    textDecoration: "underline",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
  },
});
