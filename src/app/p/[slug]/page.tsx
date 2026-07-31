import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import * as stylex from "@stylexjs/stylex";
import { getProductBySlug } from "@/lib/products";
import { getActiveDog, recommendSizeForDog } from "@/lib/dogs";
import { VariantSelector } from "@/components/commerce/variant-selector";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

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
      <div {...stylex.props(styles.breadcrumbs)}>
        <Link href="/">Home</Link> /{" "}
        {product.category && (
          <>
            <Link href={`/c/${product.category.slug}`}>{product.category.name}</Link> /{" "}
          </>
        )}
        <span {...stylex.props(styles.breadcrumbCurrent)}>{product.name}</span>
      </div>

      <section {...stylex.props(styles.layout)}>
        <div {...stylex.props(styles.mediaColumn)}>
          {product.imagePath ? (
            <div {...stylex.props(styles.mainImageWrap)}>
              <Image
                src={product.imagePath}
                alt={product.subtitle ? `${product.name}, ${product.subtitle}` : product.name}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority
                {...stylex.props(styles.objectCover)}
              />
            </div>
          ) : (
            <div
              {...stylex.props(styles.mainImageWrap, commonStyles.productTileGradient)}
              style={
                {
                  ["--tile-a" as string]: product.basePalette.a,
                  ["--tile-b" as string]: product.basePalette.b,
                } as React.CSSProperties
              }
            >
              <div {...stylex.props(styles.noImageOverlay)}>
                <span {...stylex.props(styles.noImageLabel)}>
                  {product.brandLine} — {product.category?.name}
                </span>
              </div>
            </div>
          )}

          <div {...stylex.props(styles.swatchGrid)}>
            {product.variants.slice(0, 4).map((v) => (
              <div
                key={v.id}
                {...stylex.props(styles.swatch)}
                style={{ background: v.colorHex }}
                title={`${v.color} / ${v.size.toUpperCase()}`}
                aria-label={`Color ${v.color}, size ${v.size.toUpperCase()}`}
              />
            ))}
          </div>
        </div>

        <div {...stylex.props(styles.copyColumn)}>
          <div>
            <div {...stylex.props(commonStyles.eyebrow, styles.brandEyebrow)}>
              {product.brandLine}
            </div>
            <h1 {...stylex.props(commonStyles.displayLg, styles.productName)}>
              {product.name}
            </h1>
            {product.subtitle && (
              <p {...stylex.props(styles.subtitle)}>{product.subtitle}</p>
            )}
            <div {...stylex.props(styles.price)}>
              {formatPrice(product.priceCents)}
            </div>
          </div>

          <p {...stylex.props(styles.description)}>{product.description}</p>

          {dog && recommended && (
            <div {...stylex.props(styles.fitFinderRow)}>
              <Badge tone="chartreuse">Fit finder</Badge>
              <span {...stylex.props(styles.fitFinderText)}>
                Based on {dog.name}&apos;s measurements ({dog.breed}, size{" "}
                {dog.sizeBucket.toUpperCase()}), we recommend{" "}
                <strong>{recommended.toUpperCase()}</strong>.
              </span>
            </div>
          )}

          <VariantSelector
            variants={product.variants}
            priceCents={product.priceCents}
            recommendedSize={recommended ?? null}
            activeDogName={dog?.name ?? null}
          />

          {product.editorialCopy && (
            <div {...stylex.props(styles.copyBlock)}>
              <div {...stylex.props(commonStyles.eyebrow, styles.copyBlockEyebrow)}>
                From the studio
              </div>
              <p {...stylex.props(styles.editorialCopy)}>{product.editorialCopy}</p>
            </div>
          )}

          {product.careCopy && (
            <div {...stylex.props(styles.copyBlock)}>
              <div {...stylex.props(commonStyles.eyebrow, styles.copyBlockEyebrow)}>
                Care
              </div>
              <p {...stylex.props(styles.careCopy)}>{product.careCopy}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

const styles = stylex.create({
  breadcrumbs: {
    marginInline: "auto",
    maxWidth: "1400px",
    paddingInline: "1.5rem",
    paddingBlock: "1.5rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  breadcrumbCurrent: {
    color: tokens.ink,
  },
  layout: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "grid",
    gap: "2.5rem",
    paddingInline: "1.5rem",
    paddingBottom: "5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    },
  },
  mediaColumn: {
    "@media (min-width: 768px)": {
      gridColumn: "span 7 / span 7",
    },
  },
  mainImageWrap: {
    position: "relative",
    aspectRatio: "4 / 5",
    overflow: "hidden",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
  },
  objectCover: { objectFit: "cover" },
  noImageOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "flex-end",
    padding: "2.5rem",
  },
  noImageLabel: {
    backgroundColor: "rgba(245, 241, 232, 0.9)",
    paddingInline: "0.75rem",
    paddingBlock: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: tokens.ink,
  },
  swatchGrid: {
    marginTop: "1.5rem",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "0.75rem",
  },
  swatch: {
    aspectRatio: "1 / 1",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
  },
  copyColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    "@media (min-width: 768px)": {
      gridColumn: "span 5 / span 5",
    },
  },
  brandEyebrow: { marginBottom: "0.5rem" },
  productName: {
    lineHeight: 1.25,
  },
  subtitle: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  price: {
    marginTop: "1.5rem",
    fontSize: "1.5rem",
    fontFamily: tokens.fontDisplay,
    fontVariantNumeric: "tabular-nums",
  },
  description: {
    fontSize: "0.875rem",
    lineHeight: 1.625,
    color: tokens.ink80,
  },
  fitFinderRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  fitFinderText: {
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  copyBlock: {
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
    paddingTop: "1.5rem",
  },
  copyBlockEyebrow: {
    marginBottom: "0.5rem",
  },
  editorialCopy: {
    fontSize: "0.875rem",
    fontStyle: "italic",
    color: tokens.ink80,
  },
  careCopy: {
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
});
