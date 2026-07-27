"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ensureDbReady } from "@/db/bootstrap";
import { getSession } from "@/lib/session";
import { removeFromWishlist, toggleWishlist } from "@/lib/wishlist";
import { eq } from "drizzle-orm";

const wishlistSchema = z.object({
  productId: z.string().min(1),
});

async function getProductSlug(productId: string) {
  await ensureDbReady();
  const [product] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, productId));
  return product?.slug ?? null;
}

export async function toggleWishlistAction(formData: FormData) {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");

  const parsed = wishlistSchema.parse({
    productId: formData.get("productId"),
  });
  const saved = await toggleWishlist(session.userId, parsed.productId);
  const slug = await getProductSlug(parsed.productId);
  revalidatePath("/account/wishlist");
  if (slug) revalidatePath(`/p/${slug}`);
  return { saved };
}

export async function removeFromWishlistAction(formData: FormData) {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");

  const parsed = wishlistSchema.parse({
    productId: formData.get("productId"),
  });
  await removeFromWishlist(session.userId, parsed.productId);
  const slug = await getProductSlug(parsed.productId);
  revalidatePath("/account/wishlist");
  if (slug) revalidatePath(`/p/${slug}`);
}
