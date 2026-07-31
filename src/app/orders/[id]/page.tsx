import Link from "next/link";
import { notFound } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";
import { formatPrice } from "@/lib/utils";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export default async function OrderConfirmation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureDbReady();
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return (
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.center)}>
        <div {...stylex.props(commonStyles.eyebrow, styles.eyebrow)}>
          Order confirmed
        </div>
        <h1 {...stylex.props(commonStyles.displayLg)}>Thank you.</h1>
        <p {...stylex.props(styles.confirmationText)}>
          A confirmation has been sent to <strong>{order.email}</strong>.
          {order.dogName && (
            <>
              {" "}
              {order.dogName} will be thrilled.
            </>
          )}
        </p>
        <p {...stylex.props(styles.orderId)}>
          Order {order.id}
        </p>
      </div>

      <div {...stylex.props(styles.card)}>
        <div {...stylex.props(commonStyles.eyebrow, styles.itemsEyebrow)}>Items</div>
        <ul {...stylex.props(styles.itemList)}>
          {items.map((it) => (
            <li key={it.id} {...stylex.props(styles.itemRow)}>
              <div>
                <div {...stylex.props(styles.medium)}>{it.productName}</div>
                <div {...stylex.props(styles.mutedXs)}>
                  {it.variantLabel} · Qty {it.quantity}
                </div>
              </div>
              <div {...stylex.props(styles.tabularNums)}>
                {formatPrice(it.unitPriceCents * it.quantity)}
              </div>
            </li>
          ))}
        </ul>
        <dl {...stylex.props(styles.totals)}>
          <div {...stylex.props(styles.rowBetween)}>
            <dt>Subtotal</dt>
            <dd {...stylex.props(styles.tabularNums)}>{formatPrice(order.subtotalCents)}</dd>
          </div>
          {order.discountCents > 0 && (
            <div {...stylex.props(styles.rowBetween, styles.discountRow)}>
              <dt>Discount{order.promoCode ? ` (${order.promoCode})` : ""}</dt>
              <dd {...stylex.props(styles.tabularNums)}>
                −{formatPrice(order.discountCents)}
              </dd>
            </div>
          )}
          <div {...stylex.props(styles.rowBetween)}>
            <dt>Shipping</dt>
            <dd {...stylex.props(styles.tabularNums)}>
              {order.shippingCents === 0 ? "Complimentary" : formatPrice(order.shippingCents)}
            </dd>
          </div>
          <div {...stylex.props(styles.rowBetween)}>
            <dt>Tax</dt>
            <dd {...stylex.props(styles.tabularNums)}>{formatPrice(order.taxCents)}</dd>
          </div>
          <div {...stylex.props(styles.totalRow)}>
            <dt>Total</dt>
            <dd {...stylex.props(styles.tabularNums)}>{formatPrice(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      {order.shippingAddress && (
        <div {...stylex.props(styles.shippingCard)}>
          <div {...stylex.props(commonStyles.eyebrow, styles.shippingEyebrow)}>
            Shipping to
          </div>
          <div>{order.shippingAddress.line1}</div>
          {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
          <div>
            {order.shippingAddress.city}, {order.shippingAddress.region}{" "}
            {order.shippingAddress.postalCode}
          </div>
          <div>{order.shippingAddress.country}</div>
        </div>
      )}

      <div {...stylex.props(styles.footerActionWrap)}>
        <Link
          href="/"
          {...stylex.props(styles.footerAction)}
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}

const styles = stylex.create({
  container: {
    marginInline: "auto",
    maxWidth: "48rem",
    paddingInline: "1.5rem",
    paddingBlock: "6rem",
  },
  center: { textAlign: "center" },
  eyebrow: { marginBottom: "0.75rem" },
  confirmationText: {
    marginTop: "0.75rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  orderId: {
    marginTop: "0.5rem",
    fontSize: "0.75rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink65,
  },
  card: {
    marginTop: "3rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
  },
  itemsEyebrow: { marginBottom: "1rem" },
  itemList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingBlock: "0.75rem",
    fontSize: "0.875rem",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    ":last-child": { borderBottomWidth: 0 },
  },
  medium: { fontWeight: 500 },
  mutedXs: {
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  tabularNums: {
    fontVariantNumeric: "tabular-nums",
  },
  totals: {
    marginTop: "1.5rem",
    paddingTop: "1rem",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
    display: "grid",
    gap: "0.5rem",
    fontSize: "0.875rem",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  discountRow: { color: tokens.burgundy },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
    paddingTop: "0.75rem",
    fontWeight: 500,
  },
  shippingCard: {
    marginTop: "1.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
    fontSize: "0.875rem",
  },
  shippingEyebrow: { marginBottom: "0.75rem" },
  footerActionWrap: {
    marginTop: "2.5rem",
    textAlign: "center",
  },
  footerAction: {
    display: "inline-block",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink,
    paddingInline: "1.5rem",
    paddingBlock: "0.75rem",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    ":hover": {
      backgroundColor: tokens.ink,
      color: tokens.bone,
    },
  },
});
