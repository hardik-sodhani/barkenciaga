import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";
import { formatPrice } from "@/lib/utils";

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
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <div className="eyebrow mb-3">Order confirmed</div>
        <h1 className="display-lg">Thank you.</h1>
        <p className="mt-3 text-sm text-ink-60">
          A confirmation has been sent to <strong>{order.email}</strong>.
          {order.dogName && (
            <>
              {" "}
              {order.dogName} will be thrilled.
            </>
          )}
        </p>
        <p className="mt-2 text-xs tracking-[0.2em] uppercase text-ink-65">
          Order {order.id}
        </p>
      </div>

      <div className="mt-12 border border-ink-20 bg-bone-50 p-6">
        <div className="eyebrow mb-4">Items</div>
        <ul className="divide-y divide-ink-20">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between py-3 text-sm">
              <div>
                <div className="font-medium">{it.productName}</div>
                <div className="text-xs text-ink-60">
                  {it.variantLabel} · Qty {it.quantity}
                </div>
              </div>
              <div className="tabular-nums">
                {formatPrice(it.unitPriceCents * it.quantity)}
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-ink-20 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(order.subtotalCents)}</dd>
          </div>
          {order.discountCents > 0 && (
            <div className="flex justify-between text-burgundy">
              <dt>Discount{order.promoCode ? ` (${order.promoCode})` : ""}</dt>
              <dd className="tabular-nums">
                −{formatPrice(order.discountCents)}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="tabular-nums">
              {order.shippingCents === 0 ? "Complimentary" : formatPrice(order.shippingCents)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd className="tabular-nums">{formatPrice(order.taxCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-ink-20 pt-3 font-medium">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      {order.shippingAddress && (
        <div className="mt-6 border border-ink-20 bg-bone-50 p-6 text-sm">
          <div className="eyebrow mb-3">Shipping to</div>
          <div>{order.shippingAddress.line1}</div>
          {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
          <div>
            {order.shippingAddress.city}, {order.shippingAddress.region}{" "}
            {order.shippingAddress.postalCode}
          </div>
          <div>{order.shippingAddress.country}</div>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block border border-ink px-6 py-3 text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-bone"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
