import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { getCart, getCartSummary, getCartTotals } from "@/lib/cart";
import { CartLines } from "@/components/commerce/cart-lines";
import { formatPrice } from "@/lib/utils";
import { clearCartAction } from "@/server/actions/cart";
import {
  applyPromoAction,
  removePromoAction,
} from "@/server/actions/promo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export default async function CartPage() {
  const cart = await getCart();
  const summary = await getCartSummary(cart);
  const totals = getCartTotals(
    cart.subtotalCents,
    summary.discountCents,
  );

  return (
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.leftColumn)}>
        <div {...stylex.props(commonStyles.eyebrow, styles.eyebrow)}>Your bag</div>
        <h1 {...stylex.props(commonStyles.displayLg, styles.pageTitle)}>The Bag</h1>
        <CartLines lines={cart.lines} />
        {cart.lines.length > 0 && (
          <form action={clearCartAction} {...stylex.props(styles.clearForm)}>
            <button
              type="submit"
              {...stylex.props(styles.clearButton)}
            >
              Empty bag
            </button>
          </form>
        )}
      </div>

      <aside {...stylex.props(styles.rightColumn)}>
        <div {...stylex.props(styles.summaryCard)}>
          <div {...stylex.props(commonStyles.eyebrow, styles.summaryEyebrow)}>
            Summary
          </div>
          <dl {...stylex.props(styles.summaryList)}>
            <div {...stylex.props(styles.rowBetween)}>
              <dt>Subtotal</dt>
              <dd {...stylex.props(styles.tabularNums)}>
                {formatPrice(cart.subtotalCents)}
              </dd>
            </div>
            {totals.discountCents > 0 && (
              <div {...stylex.props(styles.rowBetween, styles.discountRow)}>
                <dt>Discount{summary.promoCode ? ` (${summary.promoCode})` : ""}</dt>
                <dd {...stylex.props(styles.tabularNums)}>
                  −{formatPrice(totals.discountCents)}
                </dd>
              </div>
            )}
            <div {...stylex.props(styles.rowBetween)}>
              <dt>Shipping</dt>
              <dd {...stylex.props(styles.tabularNums)}>
                {totals.shippingCents === 0
                  ? "Complimentary"
                  : formatPrice(totals.shippingCents)}
              </dd>
            </div>
            <div {...stylex.props(styles.rowBetween)}>
              <dt>Tax (est.)</dt>
              <dd {...stylex.props(styles.tabularNums)}>{formatPrice(totals.taxCents)}</dd>
            </div>
          </dl>
          <div {...stylex.props(styles.totalRow)}>
            <span>Total</span>
            <span {...stylex.props(styles.tabularNums)}>
              {formatPrice(totals.totalCents)}
            </span>
          </div>
          {cart.lines.length > 0 && (
            <div {...stylex.props(styles.promoSection)}>
              {summary.promoCode ? (
                <div {...stylex.props(styles.rowBetween, styles.promoAppliedRow)}>
                  <div>
                    <div {...stylex.props(commonStyles.eyebrow)}>Promo applied</div>
                    <div {...stylex.props(styles.promoCodeValue)}>{summary.promoCode}</div>
                  </div>
                  <form action={removePromoAction}>
                    <button
                      type="submit"
                      {...stylex.props(styles.removePromoButton)}
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ) : (
                <form action={applyPromoAction} {...stylex.props(styles.promoForm)}>
                  <Label htmlFor="promo-code">Promo code</Label>
                  <div {...stylex.props(styles.promoInputRow)}>
                    <Input
                      id="promo-code"
                      name="code"
                      placeholder="WOOF10"
                      sx={styles.uppercaseInput}
                      required
                    />
                    <Button type="submit" variant="outline">
                      Apply
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
          {cart.lines.length > 0 ? (
            <Link
              href="/checkout"
              {...stylex.props(styles.checkoutLink)}
            >
              Proceed to checkout
            </Link>
          ) : (
            <Link
              href="/collections/autumn-woofer-26"
              {...stylex.props(styles.startShoppingLink)}
            >
              Start shopping
            </Link>
          )}
          <p {...stylex.props(styles.footnote)}>
            Free ground over $250 · Returns within 30 days
          </p>
        </div>
      </aside>
    </section>
  );
}

const styles = stylex.create({
  container: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "grid",
    gap: "3rem",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    },
  },
  leftColumn: {
    "@media (min-width: 768px)": {
      gridColumn: "span 8 / span 8",
    },
  },
  eyebrow: { marginBottom: "0.5rem" },
  pageTitle: { marginBottom: "2rem" },
  clearForm: { marginTop: "1.5rem" },
  clearButton: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink65,
    border: 0,
    backgroundColor: "transparent",
    ":hover": { color: tokens.burgundy },
  },
  rightColumn: {
    "@media (min-width: 768px)": {
      gridColumn: "span 4 / span 4",
    },
  },
  summaryCard: {
    position: "sticky",
    top: "6rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
  },
  summaryEyebrow: { marginBottom: "1.5rem" },
  summaryList: {
    display: "grid",
    gap: "0.75rem",
    fontSize: "0.875rem",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  tabularNums: {
    fontVariantNumeric: "tabular-nums",
  },
  discountRow: { color: tokens.burgundy },
  totalRow: {
    marginTop: "1.5rem",
    paddingTop: "1rem",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 500,
  },
  promoSection: {
    marginTop: "1.5rem",
    paddingTop: "1.25rem",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
  },
  promoAppliedRow: {
    alignItems: "center",
    gap: "1rem",
  },
  promoCodeValue: {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  removePromoButton: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink60,
    border: 0,
    backgroundColor: "transparent",
    ":hover": { color: tokens.burgundy },
  },
  promoForm: {
    display: "grid",
    gap: "0.5rem",
  },
  promoInputRow: {
    display: "flex",
    gap: "0.5rem",
  },
  uppercaseInput: {
    textTransform: "uppercase",
  },
  checkoutLink: {
    marginTop: "2rem",
    display: "block",
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink,
    backgroundColor: tokens.ink,
    paddingBlock: "0.75rem",
    textAlign: "center",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: tokens.bone,
    ":hover": { backgroundColor: tokens.ink80 },
  },
  startShoppingLink: {
    marginTop: "2rem",
    display: "block",
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    paddingBlock: "0.75rem",
    textAlign: "center",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    ":hover": { borderColor: tokens.ink },
  },
  footnote: {
    marginTop: "1rem",
    fontSize: "11px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: tokens.ink65,
  },
});
