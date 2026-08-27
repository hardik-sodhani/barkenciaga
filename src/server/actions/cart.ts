"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  addToCart as addToCartLib,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartLib,
} from "@/lib/cart";
import { CartInventoryError } from "@/lib/cart-inventory";
import { clearCheckoutIdempotencyKey } from "@/lib/session";

const addSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
});

export async function addToCartAction(formData: FormData) {
  const parsed = addSchema.parse({
    variantId: formData.get("variantId"),
    quantity: formData.get("quantity") ?? 1,
  });
  try {
    await addToCartLib(parsed.variantId, parsed.quantity);
    await clearCheckoutIdempotencyKey();
  } catch (error) {
    if (error instanceof CartInventoryError) {
      return { error: error.message };
    }
    throw error;
  }
  revalidatePath("/cart");
  revalidatePath("/");
  return { error: null };
}

const updateSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().min(0).max(10),
});

export type CartUpdateState = {
  error?: string;
};

export async function updateCartItemAction(
  _previousState: CartUpdateState,
  formData: FormData,
): Promise<CartUpdateState> {
  const parsed = updateSchema.parse({
    itemId: formData.get("itemId"),
    quantity: formData.get("quantity"),
  });
  try {
    await updateCartItemQuantity(parsed.itemId, parsed.quantity);
    await clearCheckoutIdempotencyKey();
  } catch (error) {
    if (error instanceof CartInventoryError) {
      return { error: error.message };
    }
    throw error;
  }
  revalidatePath("/cart");
  return {};
}

export async function removeCartItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) return;
  await removeCartItem(itemId);
  await clearCheckoutIdempotencyKey();
  revalidatePath("/cart");
}

export async function clearCartAction() {
  await clearCartLib();
  await clearCheckoutIdempotencyKey();
  revalidatePath("/cart");
}
