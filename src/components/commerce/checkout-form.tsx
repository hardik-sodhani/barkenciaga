"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  checkoutAction,
  type CheckoutState,
} from "@/server/actions/checkout";
import { formatPrice } from "@/lib/utils";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: CheckoutState = {};

export function CheckoutForm({
  defaultEmail,
  idempotencyKey,
  totalCents,
}: {
  defaultEmail: string;
  idempotencyKey: string;
  totalCents: number;
}) {
  const [state, formAction, pending] = useActionState(
    checkoutAction,
    initialState,
  );
  const cartError =
    state.error?.code === "SOLD_OUT" || state.error?.code === "EMPTY_CART";

  return (
    <form action={formAction} className="space-y-12">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      {state.error && (
        <div
          role="alert"
          className="border border-burgundy bg-bone-50 p-4 text-sm"
        >
          <p className="font-medium">{state.error.message}</p>
          {cartError && (
            <Link
              href="/cart"
              className="mt-2 inline-block text-[11px] tracking-[0.18em] uppercase underline underline-offset-4"
            >
              Update bag
            </Link>
          )}
        </div>
      )}

      <section>
        <h2 className="eyebrow mb-4">01 — Contact</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              defaultValue={defaultEmail}
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
          Demo checkout only. No charge is made. Use 4000 0000 0000 0002 to
          test a declined payment.
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

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Placing order..." : `Place order — ${formatPrice(totalCents)}`}
      </Button>
    </form>
  );
}
