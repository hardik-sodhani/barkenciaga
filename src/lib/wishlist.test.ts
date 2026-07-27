import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureDbReady } from "@/db/bootstrap";
import { products, users, wishlistItems } from "@/db/schema";
import {
  addToWishlist,
  isProductWishlisted,
  removeFromWishlist,
  toggleWishlist,
} from "@/lib/wishlist";

describe("wishlist", () => {
  let userId = "";
  let productId = "";

  beforeAll(async () => {
    await ensureDbReady();
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, "hello@barkenciaga.test"));
    const [product] = await db.select({ id: products.id }).from(products);
    if (!user || !product) {
      throw new Error("Seeded user or product not found");
    }
    userId = user.id;
    productId = product.id;
  });

  beforeEach(async () => {
    await db.delete(wishlistItems).where(eq(wishlistItems.userId, userId));
  });

  it("adds idempotently for the same user/product", async () => {
    await addToWishlist(userId, productId);
    await addToWishlist(userId, productId);

    const rows = await db
      .select()
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
    expect(rows).toHaveLength(1);
  });

  it("removes a saved product", async () => {
    await addToWishlist(userId, productId);
    await removeFromWishlist(userId, productId);

    expect(await isProductWishlisted(userId, productId)).toBe(false);
  });

  it("toggles saved state", async () => {
    expect(await toggleWishlist(userId, productId)).toBe(true);
    expect(await isProductWishlisted(userId, productId)).toBe(true);

    expect(await toggleWishlist(userId, productId)).toBe(false);
    expect(await isProductWishlisted(userId, productId)).toBe(false);
  });
});
