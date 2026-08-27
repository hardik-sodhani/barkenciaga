"use client";

import { useEffect, useState } from "react";
import { ensureCheckoutIdempotencyKeyAction } from "@/server/actions/checkout";

export function CheckoutIdempotencyField({ cartId }: { cartId: string }) {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    ensureCheckoutIdempotencyKeyAction(cartId).then(setKey);
  }, [cartId]);

  if (!key) return null;
  return <input type="hidden" name="idempotencyKey" value={key} />;
}
