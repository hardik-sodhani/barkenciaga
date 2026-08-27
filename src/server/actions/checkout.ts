"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CheckoutError, placeOrder } from "@/lib/checkout";
import {
  clearCheckoutIdempotencyKey,
  ensureCheckoutIdempotencyKey,
  getSession,
  readCartId,
} from "@/lib/session";
import { getActiveDog } from "@/lib/dogs";
import { ensureDbReady } from "@/db/bootstrap";

const checkoutSchema = z.object({
  email: z.email(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default("US"),
  cardNumber: z.string().min(12).max(30),
  cardExpiry: z.string().min(4).max(10),
  cardCvc: z.string().min(3).max(4),
  idempotencyKey: z.string().min(16).max(100),
});

export async function ensureCheckoutIdempotencyKeyAction(cartId: string) {
  return ensureCheckoutIdempotencyKey(cartId);
}

export async function checkoutAction(formData: FormData) {
  await ensureDbReady();
  const parsed = checkoutSchema.parse({
    email: formData.get("email"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "US",
    cardNumber: formData.get("cardNumber"),
    cardExpiry: formData.get("cardExpiry"),
    cardCvc: formData.get("cardCvc"),
    idempotencyKey: formData.get("idempotencyKey"),
  });

  const cartId = await readCartId();
  if (!cartId) {
    throw new CheckoutError("EMPTY_CART", "Your bag is empty.");
  }
  const idempotencyKey = await ensureCheckoutIdempotencyKey(cartId);
  const session = await getSession();
  const dog = await getActiveDog();

  const result = await placeOrder({
    cartId,
    idempotencyKey,
    userId: session.userId,
    email: parsed.email,
    shippingAddress: {
        line1: parsed.line1,
        line2: parsed.line2,
        city: parsed.city,
        region: parsed.region,
        postalCode: parsed.postalCode,
        country: parsed.country,
    },
    dogName: dog?.name ?? null,
    cardNumber: parsed.cardNumber,
  });

  console.log(
    `[barkenciaga] order ${result.orderId} ${result.replayed ? "replayed" : "confirmed"} for ${parsed.email}`,
  );

  await clearCheckoutIdempotencyKey();
  revalidatePath("/cart");
  revalidatePath("/account");
  redirect(`/orders/${result.orderId}`);
}
