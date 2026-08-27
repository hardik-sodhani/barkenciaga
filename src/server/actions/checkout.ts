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
});

export async function ensureCheckoutIdempotencyKeyAction(cartId: string) {
  return ensureCheckoutIdempotencyKey(cartId);
}

export type CheckoutState = {
  error?: {
    code: "INVALID_DETAILS" | CheckoutError["code"];
    message: string;
  };
};

export async function checkoutAction(
  _previousState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  await ensureDbReady();
  const parsed = checkoutSchema.safeParse({
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
  });
  if (!parsed.success) {
    return {
      error: {
        code: "INVALID_DETAILS",
        message: "Check your contact, shipping, and payment details and try again.",
      },
    };
  }

  const cartId = await readCartId();
  if (!cartId) {
    return { error: { code: "EMPTY_CART", message: "Your bag is empty." } };
  }
  const idempotencyKey = await ensureCheckoutIdempotencyKey(cartId);
  const session = await getSession();
  const dog = await getActiveDog();

  let result;
  try {
    result = await placeOrder({
      cartId,
      idempotencyKey,
      userId: session.userId,
      email: parsed.data.email,
      shippingAddress: {
        line1: parsed.data.line1,
        line2: parsed.data.line2,
        city: parsed.data.city,
        region: parsed.data.region,
        postalCode: parsed.data.postalCode,
        country: parsed.data.country,
      },
      dogName: dog?.name ?? null,
      cardNumber: parsed.data.cardNumber,
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { error: { code: error.code, message: error.message } };
    }
    throw error;
  }

  console.log(
    `[barkenciaga] order ${result.orderId} ${result.replayed ? "replayed" : "confirmed"} for ${parsed.data.email}`,
  );

  await clearCheckoutIdempotencyKey();
  revalidatePath("/cart");
  revalidatePath("/account");
  redirect(`/orders/${result.orderId}`);
}
