"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import {
  addWishlistItem,
  removeWishlistItem,
  moveWishlistItemToCart,
} from "@/lib/wishlist";

const variantSchema = z.object({
  variantId: z.string().min(1),
});

async function requireUserId() {
  const session = await getSession();
  if (!session.userId) {
    throw new Error("Sign in required");
  }
  return session.userId;
}

export async function toggleWishlistAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = variantSchema.parse({
    variantId: formData.get("variantId"),
  });
  const saved = formData.get("saved") === "true";
  if (saved) {
    await removeWishlistItem(userId, parsed.variantId);
  } else {
    await addWishlistItem(userId, parsed.variantId);
  }
  revalidatePath("/", "layout");
}

export async function removeFromWishlistAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = variantSchema.parse({
    variantId: formData.get("variantId"),
  });
  await removeWishlistItem(userId, parsed.variantId);
  revalidatePath("/account/wishlist");
  revalidatePath("/", "layout");
}

export async function moveWishlistToCartAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = variantSchema.parse({
    variantId: formData.get("variantId"),
  });
  await moveWishlistItemToCart(userId, parsed.variantId);
  revalidatePath("/account/wishlist");
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}
