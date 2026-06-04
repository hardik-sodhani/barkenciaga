"use client";

import { useState } from "react";
import { checkoutAction } from "@/server/actions/checkout";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type CheckoutAddress = {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type ShippingFields = {
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

const EMPTY_SHIPPING: ShippingFields = {
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "US",
};

const USE_DIFFERENT = "__different__";

function toFields(a: CheckoutAddress): ShippingFields {
  return {
    line1: a.line1,
    line2: a.line2 ?? "",
    city: a.city,
    region: a.region,
    postalCode: a.postalCode,
    country: a.country,
  };
}

function describe(a: CheckoutAddress): string {
  const name = a.label ? `${a.label} — ` : "";
  return `${name}${a.line1}, ${a.city} ${a.postalCode}`;
}

export function CheckoutForm({
  defaultEmail,
  addresses,
  defaultAddressId,
  totalLabel,
}: {
  defaultEmail: string;
  addresses: CheckoutAddress[];
  defaultAddressId: string | null;
  totalLabel: string;
}) {
  const initialId =
    defaultAddressId ?? (addresses.length > 0 ? addresses[0].id : USE_DIFFERENT);
  const initialAddress = addresses.find((a) => a.id === initialId) ?? null;

  const [selectedId, setSelectedId] = useState<string>(
    addresses.length > 0 ? initialId : USE_DIFFERENT,
  );
  const [shipping, setShipping] = useState<ShippingFields>(
    initialAddress ? toFields(initialAddress) : EMPTY_SHIPPING,
  );

  function onSelectAddress(value: string) {
    setSelectedId(value);
    if (value === USE_DIFFERENT) {
      setShipping(EMPTY_SHIPPING);
      return;
    }
    const found = addresses.find((a) => a.id === value);
    if (found) setShipping(toFields(found));
  }

  function updateField(key: keyof ShippingFields, value: string) {
    setSelectedId(USE_DIFFERENT);
    setShipping((prev) => ({ ...prev, [key]: value }));
  }

  return (
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
              defaultValue={defaultEmail}
              required
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="eyebrow mb-4">02 — Shipping</h2>

        {addresses.length > 0 && (
          <div className="mb-6">
            <Label htmlFor="savedAddress">Use a saved address</Label>
            <Select
              id="savedAddress"
              value={selectedId}
              onChange={(e) => onSelectAddress(e.target.value)}
            >
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {describe(a)}
                  {a.isDefault ? " (default)" : ""}
                </option>
              ))}
              <option value={USE_DIFFERENT}>Use a different address</option>
            </Select>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="line1">Street address</Label>
            <Input
              id="line1"
              name="line1"
              required
              value={shipping.line1}
              onChange={(e) => updateField("line1", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="line2">Apartment, suite (optional)</Label>
            <Input
              id="line2"
              name="line2"
              value={shipping.line2}
              onChange={(e) => updateField("line2", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              required
              value={shipping.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="region">State / Region</Label>
            <Input
              id="region"
              name="region"
              required
              value={shipping.region}
              onChange={(e) => updateField("region", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              required
              value={shipping.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              required
              value={shipping.country}
              onChange={(e) => updateField("country", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="eyebrow mb-4">03 — Payment</h2>
        <p className="mb-4 text-xs text-ink-60">
          Demo checkout only. No charge is made. Any card number with 12+ digits
          is accepted.
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

      <Button type="submit" size="lg" className="w-full">
        Place order — {totalLabel}
      </Button>
    </form>
  );
}
