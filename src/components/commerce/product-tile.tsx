import Link from "next/link";
import Image from "next/image";
import * as stylex from "@stylexjs/stylex";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/db/schema";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

type TileProduct = Pick<
  Product,
  "slug" | "name" | "subtitle" | "priceCents" | "basePalette" | "brandLine" | "imagePath"
>;

export function ProductTile({
  product,
  eyebrow,
  sx,
  large = false,
  priority = false,
}: {
  product: TileProduct;
  eyebrow?: string;
  sx?: stylex.StyleXStyles;
  large?: boolean;
  priority?: boolean;
}) {
  const { a, b } = product.basePalette;
  const hasImage = Boolean(product.imagePath);
  const alt = product.subtitle
    ? `${product.name}, ${product.subtitle}`
    : product.name;

  return (
    <Link href={`/p/${product.slug}`} {...stylex.props(styles.root, sx)}>
      <div
        {...stylex.props(
          styles.mediaBase,
          large ? styles.mediaLarge : styles.mediaDefault,
          !hasImage && commonStyles.productTileGradient,
        )}
        style={
          !hasImage
            ? ({
                ["--tile-a" as string]: a,
                ["--tile-b" as string]: b,
              } as React.CSSProperties)
            : undefined
        }
      >
        {hasImage ? (
          <Image
            src={product.imagePath!}
            alt={alt}
            fill
            sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            priority={priority}
            {...stylex.props(styles.image)}
          />
        ) : (
          <div {...stylex.props(styles.noImageOverlay)}>
            <span {...stylex.props(styles.noImageLabel)}>
              {eyebrow ?? product.brandLine}
            </span>
          </div>
        )}
      </div>
      <div {...stylex.props(styles.copyRow)}>
        <div>
          <div {...stylex.props(styles.name)}>{product.name}</div>
          {product.subtitle && (
            <div {...stylex.props(styles.subtitle)}>{product.subtitle}</div>
          )}
        </div>
        <div {...stylex.props(styles.price)}>
          {formatPrice(product.priceCents)}
        </div>
      </div>
    </Link>
  );
}

const styles = stylex.create({
  root: {
    display: "block",
  },
  mediaBase: {
    position: "relative",
    overflow: "hidden",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    transitionProperty: "transform",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease",
    ":hover": {
      transform: "scale(1.01)",
    },
  },
  mediaDefault: {
    aspectRatio: "4 / 5",
  },
  mediaLarge: {
    aspectRatio: "3 / 4",
  },
  image: {
    objectFit: "cover",
  },
  noImageOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "flex-end",
    padding: "1.25rem",
  },
  noImageLabel: {
    backgroundColor: "rgba(245, 241, 232, 0.9)",
    paddingInline: "0.625rem",
    paddingBlock: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: tokens.ink,
  },
  copyRow: {
    marginTop: "0.75rem",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
  },
  name: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: tokens.ink,
  },
  subtitle: {
    marginTop: "0.25rem",
    fontSize: "0.75rem",
    color: tokens.ink65,
  },
  price: {
    fontSize: "0.875rem",
    fontWeight: 500,
    fontVariantNumeric: "tabular-nums",
    color: tokens.ink,
  },
});
