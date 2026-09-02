import { db } from "./index";
import {
  categories as categoriesTable,
  collections as collectionsTable,
  collectionProducts,
  products as productsTable,
  productImages,
  productVariants,
  users as usersTable,
  dogs as dogsTable,
} from "./schema";
import {
  categories,
  collections,
  products,
  demoUsers,
  demoDogs,
} from "./seed-data";
import { nanoid } from "nanoid";

export async function seedIfEmpty() {
  const existing = await db.select().from(categoriesTable);
  if (existing.length > 0) return;

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

      const imagePath = p.imagePath ?? `/products/${p.slug}.webp`;
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

      await tx.insert(productImages).values({
        id: `img_${nanoid(10)}`,
        productId,
        path: imagePath,
        alt: p.subtitle ? `${p.name}, ${p.subtitle}` : p.name,
        position: 0,
      });

      // Extra gallery angles for a couple of hero pieces so the PDP demo has N>1 images.
      if (p.slug === "monogram-quilted-coat") {
        await tx.insert(productImages).values([
          {
            id: `img_${nanoid(10)}`,
            productId,
            path: "/products/tartan-trench.webp",
            alt: `${p.name} back view`,
            position: 1,
          },
          {
            id: `img_${nanoid(10)}`,
            productId,
            path: "/products/tech-parka.webp",
            alt: `${p.name} detail`,
            position: 2,
          },
        ]);
      }

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

  console.log(
    `[barkenciaga] seeded ${categories.length} categories, ${products.length} products, ${collections.length} collections`,
  );
}
