import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { productVariants } from "@/db/schema";

export async function setInventory(
  variantId: string,
  inventory: number,
  expectedVersion: number,
  database: typeof db = db,
) {
  const updated = await database
    .update(productVariants)
    .set({
      inventory,
      inventoryVersion: sql`${productVariants.inventoryVersion} + 1`,
    })
    .where(
      and(
        eq(productVariants.id, variantId),
        eq(productVariants.inventoryVersion, expectedVersion),
      ),
    )
    .returning({
      inventory: productVariants.inventory,
      inventoryVersion: productVariants.inventoryVersion,
    });

  return updated[0] ?? null;
}
