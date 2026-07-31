import "server-only";
import { db } from "@/db";
import { productVariants } from "@/db/schema";
import { and, inArray, lt } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";
import {
  LOW_STOCK_EYEBROW,
  LOW_STOCK_THRESHOLD,
  isLowStock,
} from "@/lib/inventory-shared";

export { LOW_STOCK_EYEBROW, LOW_STOCK_THRESHOLD, isLowStock };

export async function getLowStockProductIds(
  productIds: string[],
): Promise<Set<string>> {
  if (productIds.length === 0) return new Set();
  await ensureDbReady();
  const rows = await db
    .selectDistinct({ productId: productVariants.productId })
    .from(productVariants)
    .where(
      and(
        inArray(productVariants.productId, productIds),
        lt(productVariants.inventory, LOW_STOCK_THRESHOLD),
      ),
    );
  return new Set(rows.map((r) => r.productId));
}
