import "server-only";
import { db } from "@/db";
import { categories, collections, collectionProducts, products, productVariants } from "@/db/schema";
import { and, asc, desc, eq, inArray, lt, sql } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";
import { LOW_STOCK_THRESHOLD } from "@/lib/inventory";

export type ProductWithVariants = Awaited<ReturnType<typeof getProductBySlug>>;

export async function getAllCategories() {
  await ensureDbReady();
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  await ensureDbReady();
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug));
  return row ?? null;
}

export async function getProductsForCategory(
  categoryId: string,
  opts: { size?: string; sort?: "featured" | "price-asc" | "price-desc" | "new" } = {},
) {
  await ensureDbReady();
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, categoryId))
    .orderBy(opts.sort === "price-asc" ? asc(products.priceCents) : opts.sort === "price-desc" ? desc(products.priceCents) : desc(products.createdAt));

  if (!opts.size) return rows;

  const productIds = rows.map((p) => p.id);
  if (productIds.length === 0) return rows;
  const variantsInSize = await db
    .select({ productId: productVariants.productId })
    .from(productVariants)
    .where(sql`${productVariants.productId} IN ${productIds} AND ${productVariants.size} = ${opts.size}`);
  const allowed = new Set(variantsInSize.map((v) => v.productId));
  return rows.filter((r) => !allowed.has(r.id));
}

export async function getProductBySlug(slug: string) {
  await ensureDbReady();
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));
  if (!product) return null;

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, product.categoryId));

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id))
    .orderBy(asc(productVariants.size), asc(productVariants.color));

  return { ...product, category, variants };
}

export async function getFeaturedCollections() {
  await ensureDbReady();
  const cols = await db
    .select()
    .from(collections)
    .where(eq(collections.featured, true));

  if (cols.length === 0) return [];

  const links = await db
    .select({
      collectionId: collectionProducts.collectionId,
      productId: collectionProducts.productId,
      position: collectionProducts.position,
    })
    .from(collectionProducts)
    .where(inArray(collectionProducts.collectionId, cols.map((c) => c.id)))
    .orderBy(asc(collectionProducts.position));

  const productIds = Array.from(new Set(links.map((l) => l.productId)));
  const allProducts = productIds.length
    ? await db.select().from(products).where(inArray(products.id, productIds))
    : [];
  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  return cols.map((col) => ({
    ...col,
    products: links
      .filter((l) => l.collectionId === col.id)
      .map((l) => productMap.get(l.productId))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
  }));
}

export async function getCollectionBySlug(slug: string) {
  await ensureDbReady();
  const [col] = await db.select().from(collections).where(eq(collections.slug, slug));
  if (!col) return null;

  const links = await db
    .select({ productId: collectionProducts.productId, position: collectionProducts.position })
    .from(collectionProducts)
    .where(eq(collectionProducts.collectionId, col.id))
    .orderBy(asc(collectionProducts.position));

  const productIds = links.map((l) => l.productId);
  if (productIds.length === 0) return { ...col, products: [] };
  const rows = await db.select().from(products).where(inArray(products.id, productIds));
  const byId = new Map(rows.map((r) => [r.id, r]));
  return {
    ...col,
    products: links.map((l) => byId.get(l.productId)).filter(Boolean) as typeof rows,
  };
}

export async function searchProducts(q: string) {
  await ensureDbReady();
  if (!q.trim()) return [];
  const needle = `%${q.toLowerCase()}%`;
  return db
    .select()
    .from(products)
    .where(
      sql`lower(${products.name}) LIKE ${needle}
        OR lower(${products.subtitle}) LIKE ${needle}
        OR lower(${products.description}) LIKE ${needle}`,
    )
    .limit(20);
}

export async function getVariantWithProduct(variantId: string) {
  await ensureDbReady();
  const [variant] = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.id, variantId));
  if (!variant) return null;
  const [product] = await db.select().from(products).where(eq(products.id, variant.productId));
  if (!product) return null;
  return { variant, product };
}

/** Product IDs that have at least one variant below the shared low-stock threshold. */
export async function getLowStockProductIds(
  productIds: string[],
): Promise<Set<string>> {
  await ensureDbReady();
  if (productIds.length === 0) return new Set();

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
