import { redirect } from "next/navigation";
import { getCart, shippingCentsFor, taxCentsFor } from "@/lib/cart";
import { getSession } from "@/lib/session";
import { checkoutAction } from "@/server/actions/checkout";
import { formatPrice } from "@/lib/utils";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PromoCodeForm } from "@/components/commerce/promo-code-form";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ promoError?: string }>;
}) {
  const cart = await getCart();
  if (cart.lines.length === 0) {
    redirect("/cart");
  }

  const { promoError } = await searchParams;
  const session = await getSession();
  const shipping = shippingCentsFor(cart.subtotalCents);
  // Match checkoutAction tax base (subtotal + shipping) so the button total
  // equals what will be charged after discount.
  const tax = taxCentsFor(cart.subtotalCents + shipping);
  const total =
    Math.max(0, cart.subtotalCents - cart.discountCents) + shipping + tax;

  return (
    <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-12">
      <div className="md:col-span-7">
        <div className="eyebrow mb-2">Checkout</div>
        <h1 className="display-lg mb-8">Final steps.</h1>

        {promoError ? (
          <div
            className="mb-6 border border-burgundy/40 bg-bone-50 px-4 py-3 text-sm text-burgundy"
            role="alert"
          >
            {promoError} Your promo was removed — update your bag or continue without it.
          </div>
        ) : null}

        <form action={checkoutAction} className="space-y-12">
          <section>
            <h2 className="eyebrow mb-4">01 — Contact</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
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
            <h2 className="eyebrow mb-4">02 — Shipping</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="line1">Street address</Label>
                <Input id="line1" name="line1" required />
              </div>
              <div className="md:col-span-2">
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
            <h2 className="eyebrow mb-4">03 — Payment</h2>
            <p className="mb-4 text-xs text-ink-60">
              Demo checkout only. No charge is made. Any card number with 12+
              digits is accepted.
            </p>
            <div className="grid gap-4 md:grid-cols-6">
              <div className="md:col-span-6">
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  required
                  defaultValue="4242424242424242"
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="cardExpiry">Expiry</Label>
                <Input
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="12/29"
                  required
                  defaultValue="12/29"
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="cardCvc">CVC</Label>
                <Input id="cardCvc" name="cardCvc" placeholder="123" required defaultValue="123" />
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full">
            Place order — {formatPrice(total)}
          </Button>
        </form>
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
            {cart.discountCents > 0 && (
              <div className="flex justify-between text-burgundy">
                <dt>Discount{cart.appliedPromo ? ` (${cart.appliedPromo.code})` : ""}</dt>
                <dd className="tabular-nums">−{formatPrice(cart.discountCents)}</dd>
              </div>
            )}
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
          <PromoCodeForm
            appliedPromo={
              cart.appliedPromo
                ? {
                    code: cart.appliedPromo.code,
                    discountCents: cart.appliedPromo.discountCents,
                  }
                : null
            }
          />
        </div>
      </aside>
    </section>
  );
}
