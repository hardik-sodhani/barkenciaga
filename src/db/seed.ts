import { db } from "./index";
import {
  categories as categoriesTable,
  collections as collectionsTable,
  collectionProducts,
  products as productsTable,
  productImages as productImagesTable,
  productVariants,
  users as usersTable,
  dogs as dogsTable,
  promoCodes,
} from "./schema";
import {
  categories,
  collections,
  products,
  demoUsers,
  demoDogs,
} from "./seed-data";
import { nanoid } from "nanoid";

const demoPromoCodes = [
  {
    id: "promo_woof10",
    code: "WOOF10",
    kind: "percent" as const,
    valueInt: 10,
    minSubtotalCents: 0,
    maxRedemptions: null,
    startsAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  {
    id: "promo_flat20",
    code: "FLAT20",
    kind: "fixed" as const,
    valueInt: 2000,
    minSubtotalCents: 10000,
    maxRedemptions: 100,
    startsAt: new Date("2026-01-01T00:00:00.000Z"),
  },
];

export async function seedIfEmpty() {
  const [existingCategories, existingPromos] = await Promise.all([
    db.select().from(categoriesTable),
    db.select().from(promoCodes),
  ]);

  if (existingCategories.length > 0 && existingPromos.length > 0) return;

  await db.transaction(async (tx) => {
    if (existingPromos.length === 0) {
      await tx.insert(promoCodes).values(demoPromoCodes);
    }

    if (existingCategories.length > 0) return;

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
    const primaryPathBySlug = new Map<string, string>();
    for (const p of products) {
      const category = categories.find((c) => c.slug === p.categorySlug);
      if (!category) throw new Error(`Missing category ${p.categorySlug}`);
      const productId = `prod_${nanoid(10)}`;
      const imagePath = p.imagePath ?? `/products/${p.slug}.webp`;
      productIdBySlug.set(p.slug, productId);
      primaryPathBySlug.set(p.slug, imagePath);

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
        imagePath,
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

    // Editorial gallery: primary + up to 3 related shots so PDP demos multi-image UX.
    const angleLabels = ["Front", "Back", "Detail", "On dog"] as const;
    const allPaths = products.map((p) => primaryPathBySlug.get(p.slug)!);
    for (let i = 0; i < products.length; i++) {
      const p = products[i]!;
      const productId = productIdBySlug.get(p.slug)!;
      const primary = primaryPathBySlug.get(p.slug)!;
      const related = [
        primary,
        allPaths[(i + 1) % allPaths.length]!,
        allPaths[(i + 2) % allPaths.length]!,
        allPaths[(i + 3) % allPaths.length]!,
      ];
      await tx.insert(productImagesTable).values(
        related.map((path, position) => ({
          id: `img_${nanoid(10)}`,
          productId,
          path,
          alt: `${p.name} — ${angleLabels[position]}`,
          position,
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

  console.log(
    `[barkenciaga] seeded ${categories.length} categories, ${products.length} products, ${collections.length} collections, ${demoPromoCodes.length} promo codes`,
  );
}
