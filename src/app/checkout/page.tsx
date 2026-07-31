import { redirect } from "next/navigation";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { getCart, getCartSummary, getCartTotals } from "@/lib/cart";
import { getSession } from "@/lib/session";
import { checkoutAction } from "@/server/actions/checkout";
import { formatPrice } from "@/lib/utils";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.lines.length === 0) {
    redirect("/cart");
  }

  const session = await getSession();
  const summary = await getCartSummary(cart);
  const totals = getCartTotals(
    cart.subtotalCents,
    summary.discountCents,
  );

  return (
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.leftColumn)}>
        <div {...stylex.props(commonStyles.eyebrow, styles.topEyebrow)}>Checkout</div>
        <h1 {...stylex.props(commonStyles.displayLg, styles.pageTitle)}>Final steps.</h1>

        <form action={checkoutAction} {...stylex.props(styles.form)}>
          <section>
            <h2 {...stylex.props(commonStyles.eyebrow, styles.sectionTitle)}>
              01 — Contact
            </h2>
            <div {...stylex.props(styles.twoColGrid)}>
              <div {...stylex.props(styles.spanTwo)}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={session.userEmail ?? ""}
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h2 {...stylex.props(commonStyles.eyebrow, styles.sectionTitle)}>
              02 — Shipping
            </h2>
            <div {...stylex.props(styles.twoColGrid)}>
              <div {...stylex.props(styles.spanTwo)}>
                <Label htmlFor="line1">Street address</Label>
                <Input id="line1" name="line1" required />
              </div>
              <div {...stylex.props(styles.spanTwo)}>
                <Label htmlFor="line2">Apartment, suite (optional)</Label>
                <Input id="line2" name="line2" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="region">State / Region</Label>
                <Input id="region" name="region" required />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" name="postalCode" required />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" defaultValue="US" required />
              </div>
            </div>
          </section>

          <section>
            <h2 {...stylex.props(commonStyles.eyebrow, styles.sectionTitle)}>
              03 — Payment
            </h2>
            <p {...stylex.props(styles.paymentNote)}>
              Demo checkout only. No charge is made. Any card number with 12+
              digits is accepted.
            </p>
            <div {...stylex.props(styles.sixColGrid)}>
              <div {...stylex.props(styles.spanSix)}>
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  required
                  defaultValue="4242424242424242"
                />
              </div>
              <div {...stylex.props(styles.spanThree)}>
                <Label htmlFor="cardExpiry">Expiry</Label>
                <Input
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="12/29"
                  required
                  defaultValue="12/29"
                />
              </div>
              <div {...stylex.props(styles.spanThree)}>
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  name="cardCvc"
                  placeholder="123"
                  required
                  defaultValue="123"
                />
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" sx={styles.submitButton}>
            Place order — {formatPrice(totals.totalCents)}
          </Button>
        </form>
      </div>

      <aside {...stylex.props(styles.rightColumn)}>
        <div {...stylex.props(styles.orderCard)}>
          <div {...stylex.props(commonStyles.eyebrow, styles.orderEyebrow)}>Order</div>
          <ul {...stylex.props(styles.orderItems)}>
            {cart.lines.map((line) => (
              <li key={line.id} {...stylex.props(styles.orderItem)}>
                <div
                  {...stylex.props(
                    styles.orderTile,
                    commonStyles.productTileGradient,
                  )}
                  style={
                    {
                      ["--tile-a" as string]: line.product.basePalette.a,
                      ["--tile-b" as string]: line.product.basePalette.b,
                    } as React.CSSProperties
                  }
                />
                <div {...stylex.props(styles.itemRow)}>
                  <div>
                    <div {...stylex.props(styles.itemName)}>{line.product.name}</div>
                    <div {...stylex.props(styles.itemMeta)}>
                      {line.variant.color} / {line.variant.size.toUpperCase()} · Qty {line.quantity}
                    </div>
                  </div>
                  <div {...stylex.props(styles.itemPrice)}>
                    {formatPrice(line.lineTotalCents)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <dl {...stylex.props(styles.totals)}>
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
              <dt>Tax</dt>
              <dd {...stylex.props(styles.tabularNums)}>{formatPrice(totals.taxCents)}</dd>
            </div>
          </dl>
          {summary.promoCode && (
            <p {...stylex.props(styles.promoText)}>
              Promo {summary.promoCode} applied.{" "}
              <Link href="/cart" {...stylex.props(styles.promoLink)}>
                Change in bag
              </Link>
            </p>
          )}
          <div {...stylex.props(styles.totalRow)}>
            <span>Total</span>
            <span {...stylex.props(styles.tabularNums)}>
              {formatPrice(totals.totalCents)}
            </span>
          </div>
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
      gridColumn: "span 7 / span 7",
    },
  },
  topEyebrow: { marginBottom: "0.5rem" },
  pageTitle: { marginBottom: "2rem" },
  form: {
    display: "grid",
    gap: "3rem",
  },
  sectionTitle: { marginBottom: "1rem" },
  twoColGrid: {
    display: "grid",
    gap: "1rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  spanTwo: {
    "@media (min-width: 768px)": {
      gridColumn: "span 2 / span 2",
    },
  },
  paymentNote: {
    marginBottom: "1rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  sixColGrid: {
    display: "grid",
    gap: "1rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    },
  },
  spanSix: {
    "@media (min-width: 768px)": {
      gridColumn: "span 6 / span 6",
    },
  },
  spanThree: {
    "@media (min-width: 768px)": {
      gridColumn: "span 3 / span 3",
    },
  },
  submitButton: { width: "100%" },
  rightColumn: {
    "@media (min-width: 768px)": {
      gridColumn: "span 5 / span 5",
    },
  },
  orderCard: {
    position: "sticky",
    top: "6rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
  },
  orderEyebrow: { marginBottom: "1.5rem" },
  orderItems: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
  },
  orderItem: {
    display: "flex",
    gap: "0.75rem",
    paddingBlock: "1rem",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
  },
  orderTile: {
    position: "relative",
    aspectRatio: "1 / 1",
    width: "4rem",
    flexShrink: 0,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
  },
  itemRow: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  itemMeta: {
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  itemPrice: {
    fontSize: "0.875rem",
    fontVariantNumeric: "tabular-nums",
  },
  totals: {
    marginTop: "1.5rem",
    display: "grid",
    gap: "0.5rem",
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
  promoText: {
    marginTop: "1rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  promoLink: {
    textDecoration: "underline",
    ":hover": { color: tokens.ink },
  },
  totalRow: {
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 500,
  },
});
