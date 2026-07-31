import Link from "next/link";
import Image from "next/image";
import * as stylex from "@stylexjs/stylex";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import {
  updateCartItemAction,
  removeCartItemAction,
} from "@/server/actions/cart";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export function CartLines({ lines }: { lines: CartLine[] }) {
  if (lines.length === 0) {
    return (
      <div {...stylex.props(styles.emptyState)}>
        <div {...stylex.props(commonStyles.eyebrow, styles.emptyEyebrow)}>
          The bag
        </div>
        <p {...stylex.props(styles.emptyTitle)}>Empty and waiting.</p>
        <p {...stylex.props(styles.emptyCopy)}>
          Start with the{" "}
          <Link
            {...stylex.props(commonStyles.linkUnderline)}
            href="/collections/autumn-woofer-26"
          >
            Autumn/Woofer &apos;26
          </Link>{" "}
          edit.
        </p>
      </div>
    );
  }

  return (
    <ul {...stylex.props(styles.linesList)}>
      {lines.map((line) => (
        <li key={line.id} {...stylex.props(styles.line)}>
          {line.product.imagePath ? (
            <Link
              href={`/p/${line.product.slug}`}
              {...stylex.props(styles.imageLink)}
            >
              <Image
                src={line.product.imagePath}
                alt={line.product.subtitle ? `${line.product.name}, ${line.product.subtitle}` : line.product.name}
                fill
                sizes="96px"
                {...stylex.props(styles.objectCover)}
              />
            </Link>
          ) : (
            <div
              {...stylex.props(styles.noImageTile, commonStyles.productTileGradient)}
              style={
                {
                  ["--tile-a" as string]: line.product.basePalette.a,
                  ["--tile-b" as string]: line.product.basePalette.b,
                } as React.CSSProperties
              }
            >
              <span {...stylex.props(styles.noImageLabel)}>
                {line.product.name.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
          )}
          <div {...stylex.props(styles.lineContent)}>
            <div>
              <div {...stylex.props(styles.topRow)}>
                <Link
                  href={`/p/${line.product.slug}`}
                  {...stylex.props(styles.productLink)}
                >
                  {line.product.name}
                </Link>
                <div {...stylex.props(styles.tabularNums)}>
                  {formatPrice(line.lineTotalCents)}
                </div>
              </div>
              <div {...stylex.props(styles.variantLabel)}>
                {line.variant.color} / Size {line.variant.size.toUpperCase()}
              </div>
              <div {...stylex.props(styles.sku)}>
                SKU {line.variant.sku}
              </div>
            </div>
            <div {...stylex.props(styles.actionsRow)}>
              <form action={updateCartItemAction} {...stylex.props(styles.qtyForm)}>
                <input type="hidden" name="itemId" value={line.id} />
                <button
                  type="submit"
                  name="quantity"
                  value={line.quantity + 1}
                  {...stylex.props(styles.qtyButton)}
                  aria-label="Decrease"
                >
                  -
                </button>
                <div {...stylex.props(styles.qtyValue)}>{line.quantity}</div>
                <button
                  type="submit"
                  name="quantity"
                  value={line.quantity - 1}
                  {...stylex.props(styles.qtyButton)}
                  aria-label="Increase"
                >
                  +
                </button>
              </form>
              <form action={removeCartItemAction}>
                <input type="hidden" name="itemId" value={line.id} />
                <button
                  type="submit"
                  {...stylex.props(styles.removeButton)}
                >
                  Remove
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

const styles = stylex.create({
  emptyState: {
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: tokens.ink20,
    padding: "3rem",
    textAlign: "center",
  },
  emptyEyebrow: {
    marginBottom: "0.75rem",
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
  linesList: {
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  line: {
    display: "flex",
    gap: "1rem",
    paddingBlock: "1.5rem",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    ":last-child": {
      borderBottomWidth: 0,
    },
  },
  imageLink: {
    position: "relative",
    aspectRatio: "4 / 5",
    width: "5rem",
    flexShrink: 0,
    overflow: "hidden",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    "@media (min-width: 768px)": {
      width: "6rem",
    },
  },
  objectCover: {
    objectFit: "cover",
  },
  noImageTile: {
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    aspectRatio: "4 / 5",
    width: "5rem",
    flexShrink: 0,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    padding: "0.75rem",
    "@media (min-width: 768px)": {
      width: "6rem",
    },
  },
  noImageLabel: {
    backgroundColor: "rgba(245, 241, 232, 0.9)",
    paddingInline: "0.5rem",
    paddingBlock: "0.125rem",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: tokens.ink,
  },
  lineContent: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
  },
  productLink: {
    fontWeight: 500,
    ":hover": {
      color: tokens.burgundy,
    },
  },
  tabularNums: {
    fontVariantNumeric: "tabular-nums",
  },
  variantLabel: {
    marginTop: "0.25rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  sku: {
    marginTop: "0.25rem",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: tokens.ink65,
  },
  actionsRow: {
    marginTop: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyForm: {
    display: "flex",
    alignItems: "center",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
  },
  qtyButton: {
    height: "2.25rem",
    width: "2.25rem",
    border: 0,
    backgroundColor: "transparent",
    ":hover": {
      backgroundColor: tokens.bone200,
    },
  },
  qtyValue: {
    width: "2rem",
    textAlign: "center",
    fontSize: "0.875rem",
    fontVariantNumeric: "tabular-nums",
  },
  removeButton: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink65,
    border: 0,
    backgroundColor: "transparent",
    ":hover": {
      color: tokens.burgundy,
    },
  },
});
