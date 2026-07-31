import { notFound } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { getCollectionBySlug } from "@/lib/products";
import { ProductTile } from "@/components/commerce/product-tile";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

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
      <section {...stylex.props(styles.heroSection)}>
        <div {...stylex.props(styles.heroContainer)}>
          <div {...stylex.props(commonStyles.eyebrow, styles.eyebrow)}>
            {collection.season}
          </div>
          <h1 {...stylex.props(commonStyles.displayXl)}>{collection.name}</h1>
          {collection.tagline && (
            <p {...stylex.props(styles.tagline)}>
              {collection.tagline}
            </p>
          )}
        </div>
      </section>

      <section {...stylex.props(styles.productsSection)}>
        <div {...stylex.props(styles.productsGrid)}>
          {collection.products.map((p, i) => (
            <ProductTile
              key={p.id}
              product={p}
              large={i === 0}
              eyebrow={i === 0 ? "Editor's pick" : undefined}
              sx={i === 0 ? styles.featuredTile : undefined}
            />
          ))}
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
    paddingInline: "1.5rem",
    paddingBlock: "5rem",
  },
  eyebrow: {
    marginBottom: "0.75rem",
  },
  tagline: {
    marginTop: "1rem",
    maxWidth: "36rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  productsSection: {
    marginInline: "auto",
    maxWidth: "1400px",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  featuredTile: {
    gridColumn: "span 2 / span 2",
    gridRow: "span 2 / span 2",
  },
});
