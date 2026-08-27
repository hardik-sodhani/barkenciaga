import { redirect } from "next/navigation";
import { getCart, shippingCentsFor, taxCentsFor } from "@/lib/cart";
import { getSession } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { CheckoutForm } from "@/components/commerce/checkout-form";

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.lines.length === 0) {
    redirect("/cart");
  }

  const session = await getSession();
  const shipping = shippingCentsFor(cart.subtotalCents);
  const tax = taxCentsFor(cart.subtotalCents);
  const total = cart.subtotalCents + shipping + tax;

  return (
    <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-12">
      <div className="md:col-span-7">
        <div className="eyebrow mb-2">Checkout</div>
        <h1 className="display-lg mb-8">Final steps.</h1>

        <CheckoutForm
          cartId={cart.cartId!}
          defaultEmail={session.userEmail ?? ""}
          totalCents={total}
        />
      </div>

      <aside className="md:col-span-5">
        <div className="sticky top-24 border border-ink-20 bg-bone-50 p-6">
          <div className="eyebrow mb-6">Order</div>
          <ul className="divide-y divide-ink-20">
            {cart.lines.map((line) => (
              <li key={line.id} className="flex gap-3 py-4">
                <div
                  className="product-tile-gradient relative aspect-square w-16 flex-shrink-0 border border-ink-20"
                  style={
                    {
                      ["--tile-a" as string]: line.product.basePalette.a,
                      ["--tile-b" as string]: line.product.basePalette.b,
                    } as React.CSSProperties
                  }
                />
                <div className="flex flex-1 justify-between">
                  <div>
                    <div className="text-sm font-medium">{line.product.name}</div>
                    <div className="text-xs text-ink-60">
                      {line.variant.color} / {line.variant.size.toUpperCase()} · Qty {line.quantity}
                    </div>
                  </div>
                  <div className="text-sm tabular-nums">
                    {formatPrice(line.lineTotalCents)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(cart.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd className="tabular-nums">
                {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Tax</dt>
              <dd className="tabular-nums">{formatPrice(tax)}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-ink-20 pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
