import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { ensureDbReady } from "@/db/bootstrap";
import { products, wishlistItems } from "@/db/schema";

export type WishlistProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  priceCents: number;
  brandLine: string;
  basePalette: { a: string; b: string };
  imagePath: string | null;
  savedAt: Date;
};

export async function addToWishlist(userId: string, productId: string) {
  await ensureDbReady();
  await db
    .insert(wishlistItems)
    .values({
      id: `wish_${nanoid(10)}`,
      userId,
      productId,
    })
    .onConflictDoNothing({
      target: [wishlistItems.userId, wishlistItems.productId],
    });
}

export async function removeFromWishlist(userId: string, productId: string) {
  await ensureDbReady();
  await db
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
}

export async function isProductWishlisted(userId: string, productId: string) {
  await ensureDbReady();
  const [row] = await db
    .select({ id: wishlistItems.id })
    .from(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
  return Boolean(row);
}

export async function toggleWishlist(userId: string, productId: string) {
  await ensureDbReady();
  const saved = await isProductWishlisted(userId, productId);
  if (saved) {
    await removeFromWishlist(userId, productId);
    return false;
  }
  await addToWishlist(userId, productId);
  return true;
}

export async function getWishlistProductIds(userId: string) {
  await ensureDbReady();
  const rows = await db
    .select({ productId: wishlistItems.productId })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.createdAt));
  return rows.map((row) => row.productId);
}

export async function getWishlistForUser(userId: string): Promise<WishlistProduct[]> {
  await ensureDbReady();
  return db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      subtitle: products.subtitle,
      priceCents: products.priceCents,
      brandLine: products.brandLine,
      basePalette: products.basePalette,
      imagePath: products.imagePath,
      savedAt: wishlistItems.createdAt,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.createdAt));
}
