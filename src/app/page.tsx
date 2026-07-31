import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { getFeaturedCollections, getAllCategories } from "@/lib/products";
import { ProductTile } from "@/components/commerce/product-tile";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export default async function HomePage() {
  const [collections, categories] = await Promise.all([
    getFeaturedCollections(),
    getAllCategories(),
  ]);

  const hero = collections.find((c) => c.slug === "autumn-woofer-26");
  const blackTie = collections.find((c) => c.slug === "black-tie");
  const commuter = collections.find((c) => c.slug === "city-commuter");

  return (
    <>
      {/* Hero */}
      <section {...stylex.props(styles.heroSection)}>
        <div {...stylex.props(styles.heroContainer)}>
          <div {...stylex.props(styles.heroCopy)}>
            <div {...stylex.props(commonStyles.eyebrow, styles.heroEyebrow)}>
              AW/26 — Editorial 01
            </div>
            <h1 {...stylex.props(commonStyles.displayXl)}>
              High fashion.
              <br />
              <span {...stylex.props(styles.italic)}>For dogs.</span>
            </h1>
            <p {...stylex.props(styles.heroText)}>
              Couture, accessories, eyewear, and footwear - engineered for the
              discerning dog and the humans who walk them. Hand-finished in
              Milan. Approved by a panel of six studio canines.
            </p>
            <div {...stylex.props(styles.heroActions)}>
              <Link
                href="/collections/autumn-woofer-26"
                {...stylex.props(styles.primaryCta)}
              >
                Shop Autumn/Woofer &apos;26
              </Link>
              <Link
                href="/account/dogs/new"
                {...stylex.props(styles.secondaryCta)}
              >
                Build a dog profile
              </Link>
            </div>
          </div>
          <div {...stylex.props(styles.heroTiles)}>
            {hero?.products.slice(0, 4).map((p) => (
              <ProductTile key={p.id} product={p} priority />
            ))}
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section {...stylex.props(styles.categorySection)}>
        <div {...stylex.props(styles.categoryGrid)}>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/c/${c.slug}`}
              {...stylex.props(styles.categoryCard)}
            >
              <div {...stylex.props(commonStyles.eyebrow, styles.categoryEyebrow)}>
                Shop
              </div>
              <div {...stylex.props(styles.categoryName)}>{c.name}</div>
              <div {...stylex.props(styles.categoryTagline)}>{c.tagline}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured collection */}
      {hero && (
        <section {...stylex.props(styles.featuredSection)}>
          <div {...stylex.props(styles.featuredHeader)}>
            <div>
              <div {...stylex.props(commonStyles.eyebrow, styles.seasonEyebrow)}>
                The season
              </div>
              <h2 {...stylex.props(commonStyles.displayLg)}>{hero.name}</h2>
              <p {...stylex.props(styles.featuredTagline)}>{hero.tagline}</p>
            </div>
            <Link
              href={`/collections/${hero.slug}`}
              {...stylex.props(styles.inlineLink)}
            >
              See all ({hero.products.length}) →
            </Link>
          </div>
          <div {...stylex.props(styles.featuredGrid)}>
            {hero.products.slice(0, 8).map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Editorial split */}
      {blackTie && commuter && (
        <section {...stylex.props(styles.editorialSection)}>
          {[blackTie, commuter].map((col) => (
            <div key={col.id} {...stylex.props(styles.editorialCard)}>
              <div {...stylex.props(commonStyles.eyebrow, styles.editorialEyebrow)}>
                {col.season}
              </div>
              <h3 {...stylex.props(styles.editorialTitle)}>{col.name}</h3>
              <p {...stylex.props(styles.editorialTagline)}>{col.tagline}</p>
              <div {...stylex.props(styles.editorialTiles)}>
                {col.products.slice(0, 4).map((p) => (
                  <ProductTile key={p.id} product={p} />
                ))}
              </div>
              <Link
                href={`/collections/${col.slug}`}
                {...stylex.props(styles.inlineBlockLink)}
              >
                Shop the edit →
              </Link>
            </div>
          ))}
        </section>
      )}

      {/* Editorial footer */}
      <section {...stylex.props(styles.footerSection)}>
        <div {...stylex.props(styles.footerContainer)}>
          <div>
            <div {...stylex.props(commonStyles.eyebrow, styles.footerEyebrow)}>
              The studio
            </div>
            <h2 {...stylex.props(commonStyles.displayLg, styles.footerTitle)}>
              Designed around the dog, not the human.
            </h2>
          </div>
          <div {...stylex.props(styles.footerCopy)}>
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
    </>
  );
}

const styles = stylex.create({
  heroSection: {
    position: "relative",
    overflow: "hidden",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
  },
  heroContainer: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "2rem",
    paddingInline: "1.5rem",
    paddingBlock: "6rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    },
  },
  heroCopy: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    "@media (min-width: 768px)": {
      gridColumn: "span 7 / span 7",
    },
  },
  heroEyebrow: { marginBottom: "1.5rem" },
  italic: { fontStyle: "italic" },
  heroText: {
    marginTop: "1.5rem",
    maxWidth: "36rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  heroActions: {
    marginTop: "2rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  primaryCta: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink,
    backgroundColor: tokens.ink,
    paddingInline: "1.5rem",
    paddingBlock: "0.75rem",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: tokens.bone,
    ":hover": {
      backgroundColor: tokens.ink80,
    },
  },
  secondaryCta: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    paddingInline: "1.5rem",
    paddingBlock: "0.75rem",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: tokens.ink,
    ":hover": {
      borderColor: tokens.ink,
    },
  },
  heroTiles: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1rem",
    "@media (min-width: 768px)": {
      gridColumn: "span 5 / span 5",
    },
  },
  categorySection: {
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    backgroundColor: tokens.bone100,
  },
  categoryGrid: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  categoryCard: {
    borderRightWidth: "1px",
    borderRightStyle: "solid",
    borderRightColor: tokens.ink20,
    padding: "2.5rem",
    textAlign: "center",
    ":hover": {
      backgroundColor: tokens.bone200,
    },
    ":last-child": {
      borderRightWidth: 0,
    },
  },
  categoryEyebrow: { marginBottom: "0.5rem" },
  categoryName: {
    fontFamily: tokens.fontDisplay,
    fontSize: "2.25rem",
  },
  categoryTagline: {
    marginTop: "0.5rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  featuredSection: {
    marginInline: "auto",
    maxWidth: "1400px",
    paddingInline: "1.5rem",
    paddingBlock: "5rem",
  },
  featuredHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "2.5rem",
  },
  seasonEyebrow: { marginBottom: "0.5rem" },
  featuredTagline: {
    marginTop: "0.75rem",
    maxWidth: "32rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  inlineLink: {
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    ":hover": {
      color: tokens.burgundy,
    },
  },
  featuredGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  editorialSection: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "grid",
    gap: "2.5rem",
    paddingInline: "1.5rem",
    paddingBottom: "5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  editorialCard: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "2rem",
  },
  editorialEyebrow: { marginBottom: "0.5rem" },
  editorialTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: "2.25rem",
  },
  editorialTagline: {
    marginTop: "0.75rem",
    maxWidth: "28rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  editorialTiles: {
    marginTop: "1.5rem",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "0.75rem",
  },
  inlineBlockLink: {
    marginTop: "1.5rem",
    display: "inline-block",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    ":hover": {
      color: tokens.burgundy,
    },
  },
  footerSection: {
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
    backgroundColor: tokens.ink,
    color: tokens.bone,
  },
  footerContainer: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "grid",
    gap: "2.5rem",
    paddingInline: "1.5rem",
    paddingBlock: "6rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  footerEyebrow: {
    color: tokens.bone300,
    marginBottom: "1rem",
  },
  footerTitle: {
    color: tokens.bone,
  },
  footerCopy: {
    display: "grid",
    gap: "1rem",
    fontSize: "0.875rem",
    color: "rgba(245, 241, 232, 0.8)",
    "@media (min-width: 768px)": {
      marginTop: "2.5rem",
    },
  },
});
