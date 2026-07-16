import { db } from "./index";
import {
  categories as categoriesTable,
  collections as collectionsTable,
  collectionProducts,
  products as productsTable,
  productVariants,
  users as usersTable,
  dogs as dogsTable,
  promoCodes as promoCodesTable,
} from "./schema";
import {
  categories,
  collections,
  products,
  demoUsers,
  demoDogs,
} from "./seed-data";
import { nanoid } from "nanoid";

async function seedPromosIfEmpty() {
  const existing = await db.select().from(promoCodesTable).limit(1);
  if (existing.length > 0) return;

  const now = Date.now();
  await db.insert(promoCodesTable).values([
    {
      id: "promo_woofer20",
      code: "WOOFER20",
      kind: "percent",
      valueInt: 20,
      minSubtotalCents: 10000,
      maxRedemptions: null,
      redemptionsCount: 0,
      startsAt: new Date(now - 7 * 24 * 60 * 60 * 1000),
      endsAt: new Date(now + 90 * 24 * 60 * 60 * 1000),
      active: true,
    },
    {
      id: "promo_bark10",
      code: "BARK10",
      kind: "fixed",
      valueInt: 1000,
      minSubtotalCents: 0,
      maxRedemptions: null,
      redemptionsCount: 0,
      startsAt: null,
      endsAt: null,
      active: true,
    },
    {
      id: "promo_launch1",
      code: "LAUNCH1",
      kind: "percent",
      valueInt: 15,
      minSubtotalCents: 0,
      maxRedemptions: 1,
      redemptionsCount: 0,
      startsAt: new Date(now - 24 * 60 * 60 * 1000),
      endsAt: new Date(now + 30 * 24 * 60 * 60 * 1000),
      active: true,
    },
    {
      id: "promo_expired",
      code: "EXPIRED",
      kind: "percent",
      valueInt: 50,
      minSubtotalCents: 0,
      maxRedemptions: null,
      redemptionsCount: 0,
      startsAt: new Date(now - 60 * 24 * 60 * 60 * 1000),
      endsAt: new Date(now - 7 * 24 * 60 * 60 * 1000),
      active: true,
    },
  ]);
  console.log("[barkenciaga] seeded 4 promo codes");
}

export async function seedIfEmpty() {
  const existing = await db.select().from(categoriesTable);
  if (existing.length > 0) {
    await seedPromosIfEmpty();
    return;
  }

  await db.transaction(async (tx) => {
    await tx.insert(categoriesTable).values(
      categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        heroCopy: c.heroCopy,
        sortOrder: c.sortOrder,
      })),
    );

    await tx.insert(collectionsTable).values(
      collections.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        season: c.season,
        featured: c.featured,
      })),
    );

    const productIdBySlug = new Map<string, string>();
    for (const p of products) {
      const category = categories.find((c) => c.slug === p.categorySlug);
      if (!category) throw new Error(`Missing category ${p.categorySlug}`);
      const productId = `prod_${nanoid(10)}`;
      productIdBySlug.set(p.slug, productId);

      await tx.insert(productsTable).values({
        id: productId,
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        description: p.description,
        categoryId: category.id,
        brandLine: "Barkenciaga",
        priceCents: p.priceCents,
        basePalette: p.palette,
        imagePath: p.imagePath ?? `/products/${p.slug}.webp`,
        editorialCopy: p.editorialCopy,
        careCopy: p.careCopy,
      });

      await tx.insert(productVariants).values(
        p.variants.map((v) => ({
          id: `var_${nanoid(10)}`,
          productId,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          sku: `BRK-${p.slug.slice(0, 6).toUpperCase()}-${v.size.toUpperCase()}-${v.color.replace(/\s+/g, "").slice(0, 4).toUpperCase()}`,
          inventory: v.inventory,
        })),
      );
    }

    for (const col of collections) {
      await tx.insert(collectionProducts).values(
        col.productSlugs.map((slug, idx) => {
          const productId = productIdBySlug.get(slug);
          if (!productId) throw new Error(`Missing product ${slug} in collection ${col.slug}`);
          return {
            collectionId: col.id,
            productId,
            position: idx,
          };
        }),
      );
    }

    await tx.insert(usersTable).values(demoUsers);
    await tx.insert(dogsTable).values(demoDogs);
  });

  await seedPromosIfEmpty();

  console.log(
    `[barkenciaga] seeded ${categories.length} categories, ${products.length} products, ${collections.length} collections`,
  );
}
