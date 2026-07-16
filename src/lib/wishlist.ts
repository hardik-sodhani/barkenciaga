import "server-only";
import { db } from "@/db";
import { wishlistItems, productVariants, products } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ensureDbReady } from "@/db/bootstrap";
import { addToCart } from "./cart";

export type WishlistLine = {
  id: string;
  variantId: string;
  createdAt: Date;
  product: {
    id: string;
    slug: string;
    name: string;
    subtitle: string | null;
    basePalette: { a: string; b: string };
    imagePath: string | null;
  };
  variant: {
    size: string;
    color: string;
    colorHex: string;
    sku: string;
    inventory: number;
  };
  unitPriceCents: number;
};

export async function getWishlistedVariantIdsForProduct(
  userId: string,
  productId: string,
): Promise<string[]> {
  await ensureDbReady();
  const rows = await db
    .select({ variantId: wishlistItems.variantId })
    .from(wishlistItems)
    .innerJoin(productVariants, eq(wishlistItems.variantId, productVariants.id))
    .where(
      and(eq(wishlistItems.userId, userId), eq(productVariants.productId, productId)),
    );
  return rows.map((r) => r.variantId);
}

export async function getWishlistForUser(userId: string): Promise<WishlistLine[]> {
  await ensureDbReady();
  const rows = await db
    .select({
      id: wishlistItems.id,
      variantId: wishlistItems.variantId,
      createdAt: wishlistItems.createdAt,
      productId: products.id,
      productSlug: products.slug,
      productName: products.name,
      productSubtitle: products.subtitle,
      productPalette: products.basePalette,
      productImagePath: products.imagePath,
      priceCents: products.priceCents,
      size: productVariants.size,
      color: productVariants.color,
      colorHex: productVariants.colorHex,
      sku: productVariants.sku,
      inventory: productVariants.inventory,
    })
    .from(wishlistItems)
    .innerJoin(productVariants, eq(wishlistItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.createdAt));

  return rows.map((r) => ({
    id: r.id,
    variantId: r.variantId,
    createdAt: r.createdAt,
    product: {
      id: r.productId,
      slug: r.productSlug,
      name: r.productName,
      subtitle: r.productSubtitle,
      basePalette: r.productPalette,
      imagePath: r.productImagePath,
    },
    variant: {
      size: r.size,
      color: r.color,
      colorHex: r.colorHex,
      sku: r.sku,
      inventory: r.inventory,
    },
    unitPriceCents: r.priceCents,
  }));
}

export async function addWishlistItem(userId: string, variantId: string) {
  await ensureDbReady();
  await db
    .insert(wishlistItems)
    .values({
      id: `wl_${nanoid(10)}`,
      userId,
      variantId,
    })
    .onConflictDoNothing();
}

export async function removeWishlistItem(userId: string, variantId: string) {
  await ensureDbReady();
  await db
    .delete(wishlistItems)
    .where(
      and(eq(wishlistItems.userId, userId), eq(wishlistItems.variantId, variantId)),
    );
}

export async function moveWishlistItemToCart(userId: string, variantId: string) {
  await addToCart(variantId, 1);
  await removeWishlistItem(userId, variantId);
}
