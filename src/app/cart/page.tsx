import Link from "next/link";
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

export default async function CartPage() {
  const cart = await getCart();
  const summary = await getCartSummary(cart);
  const totals = getCartTotals(
    cart.subtotalCents,
    summary.discountCents,
  );

  return (
    <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-12">
      <div className="md:col-span-8">
        <div className="eyebrow mb-2">Your bag</div>
        <h1 className="display-lg mb-8">The Bag</h1>
        <CartLines lines={cart.lines} />
        {cart.lines.length > 0 && (
          <form action={clearCartAction} className="mt-6">
            <button
              type="submit"
              className="text-[11px] tracking-[0.2em] uppercase text-ink-65 hover:text-burgundy"
            >
              Empty bag
            </button>
          </form>
        )}
      </div>

      <aside className="md:col-span-4">
        <div className="sticky top-24 border border-ink-20 bg-bone-50 p-6">
          <div className="eyebrow mb-6">Summary</div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(cart.subtotalCents)}</dd>
            </div>
            {totals.discountCents > 0 && (
              <div className="flex justify-between text-burgundy">
                <dt>Discount{summary.promoCode ? ` (${summary.promoCode})` : ""}</dt>
                <dd className="tabular-nums">
                  −{formatPrice(totals.discountCents)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd className="tabular-nums">
                {totals.shippingCents === 0
                  ? "Complimentary"
                  : formatPrice(totals.shippingCents)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Tax (est.)</dt>
              <dd className="tabular-nums">{formatPrice(totals.taxCents)}</dd>
            </div>
          </dl>
          <div className="mt-6 border-t border-ink-20 pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(totals.totalCents)}</span>
          </div>
          {cart.lines.length > 0 && (
            <div className="mt-6 border-t border-ink-20 pt-5">
              {summary.promoCode ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="eyebrow">Promo applied</div>
                    <div className="mt-1 text-sm font-medium">{summary.promoCode}</div>
                  </div>
                  <form action={removePromoAction}>
                    <button
                      type="submit"
                      className="text-[10px] tracking-[0.2em] uppercase text-ink-60 hover:text-burgundy"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ) : (
                <form action={applyPromoAction} className="space-y-2">
                  <Label htmlFor="promo-code">Promo code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="promo-code"
                      name="code"
                      placeholder="WOOF10"
                      className="uppercase"
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
              className="mt-8 block w-full border border-ink bg-ink py-3 text-center text-[11px] tracking-[0.24em] uppercase text-bone hover:bg-ink-80"
            >
              Proceed to checkout
            </Link>
          ) : (
            <Link
              href="/collections/autumn-woofer-26"
              className="mt-8 block w-full border border-ink-20 py-3 text-center text-[11px] tracking-[0.24em] uppercase hover:border-ink"
            >
              Start shopping
            </Link>
          )}
          <p className="mt-4 text-[11px] tracking-wider uppercase text-ink-65">
            Free ground over $250 · Returns within 30 days
          </p>
        </div>
      </aside>
    </section>
  );
}
