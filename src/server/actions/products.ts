"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import path from "node:path";
import fs from "node:fs/promises";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { productImages, products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { imagesWithPositions } from "@/lib/product-images";

async function syncProductDefaultImage(productId: string) {
  const [first] = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.position))
    .limit(1);

  await db
    .update(products)
    .set({ imagePath: first?.path ?? null })
    .where(eq(products.id, productId));
}

async function revalidateProductPaths(productId: string) {
  const [product] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, productId));
  revalidatePath("/admin");
  if (product) revalidatePath(`/p/${product.slug}`);
}

const productUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  subtitle: z.string().max(160).optional(),
  priceCents: z.coerce.number().int().min(100).max(5_000_000),
  description: z.string().min(1),
});

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const parsed = productUpdateSchema.parse({
    id: formData.get("id"),
    name: formData.get("name"),
    subtitle: formData.get("subtitle") || undefined,
    priceCents: formData.get("priceCents"),
    description: formData.get("description"),
  });
  await db
    .update(products)
    .set({
      name: parsed.name,
      subtitle: parsed.subtitle ?? null,
      priceCents: parsed.priceCents,
      description: parsed.description,
    })
    .where(eq(products.id, parsed.id));
  revalidatePath("/admin");
  revalidatePath(`/p/[slug]`, "page");
}

const variantInventorySchema = z.object({
  id: z.string().min(1),
  inventory: z.coerce.number().int().min(0).max(9999),
});

export async function updateVariantInventoryAction(formData: FormData) {
  await requireAdmin();
  const parsed = variantInventorySchema.parse({
    id: formData.get("id"),
    inventory: formData.get("inventory"),
  });
  await db
    .update(productVariants)
    .set({ inventory: parsed.inventory })
    .where(eq(productVariants.id, parsed.id));
  revalidatePath("/admin");
}

const newVariantSchema = z.object({
  productId: z.string().min(1),
  size: z.enum(["xs", "s", "m", "l", "xl"]),
  color: z.string().min(1).max(40),
  colorHex: z.string().min(4).max(9),
  inventory: z.coerce.number().int().min(0).max(9999),
});

export async function createVariantAction(formData: FormData) {
  await requireAdmin();
  const parsed = newVariantSchema.parse({
    productId: formData.get("productId"),
    size: formData.get("size"),
    color: formData.get("color"),
    colorHex: formData.get("colorHex"),
    inventory: formData.get("inventory"),
  });

  const existing = await db
    .select()
    .from(productVariants)
    .where(
      and(
        eq(productVariants.productId, parsed.productId),
        eq(productVariants.size, parsed.size),
        eq(productVariants.color, parsed.color),
      ),
    );
  if (existing.length > 0) {
    throw new Error("Variant already exists");
  }

  await db.insert(productVariants).values({
    id: `var_${nanoid(10)}`,
    productId: parsed.productId,
    size: parsed.size,
    color: parsed.color,
    colorHex: parsed.colorHex,
    sku: `BRK-ADM-${parsed.size.toUpperCase()}-${parsed.color.replace(/\s+/g, "").slice(0, 4).toUpperCase()}-${nanoid(4)}`,
    inventory: parsed.inventory,
  });
  revalidatePath("/admin");
}

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadProductImageAction(formData: FormData) {
  await requireAdmin();
  const productId = z.string().min(1).parse(formData.get("productId"));
  const alt = z.string().max(160).optional().parse(formData.get("alt") || undefined) ?? "";
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Image file is required");
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported image type");
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Image must be 2MB or smaller");
  }

  const [product] = await db.select().from(products).where(eq(products.id, productId));
  if (!product) throw new Error("Product not found");

  const existing = await db
    .select({ position: productImages.position })
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.position));
  const nextPosition =
    existing.length === 0
      ? 0
      : Math.max(...existing.map((row) => row.position)) + 1;

  const ext = EXT_BY_TYPE[file.type] ?? "webp";
  const filename = `${product.slug}-${nanoid(8)}.${ext}`;
  const publicPath = `/products/${filename}`;
  const diskPath = path.join(process.cwd(), "public", "products", filename);
  await fs.mkdir(path.dirname(diskPath), { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(diskPath, bytes);

  await db.insert(productImages).values({
    id: `img_${nanoid(10)}`,
    productId,
    path: publicPath,
    alt: alt || `${product.name} — Image ${nextPosition + 1}`,
    position: nextPosition,
  });
  await syncProductDefaultImage(productId);
  await revalidateProductPaths(productId);
}

export async function reorderProductImagesAction(formData: FormData) {
  await requireAdmin();
  const productId = z.string().min(1).parse(formData.get("productId"));
  const orderedIdsRaw = z.string().min(1).parse(formData.get("orderedIds"));
  const orderedIds = z.array(z.string().min(1)).parse(JSON.parse(orderedIdsRaw));

  const rows = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId));
  const owned = new Set(rows.map((row) => row.id));
  if (orderedIds.length !== rows.length || orderedIds.some((id) => !owned.has(id))) {
    throw new Error("Invalid image order payload");
  }

  const positions = imagesWithPositions(orderedIds);
  await db.transaction(async (tx) => {
    for (const row of positions) {
      await tx
        .update(productImages)
        .set({ position: row.position })
        .where(and(eq(productImages.id, row.id), eq(productImages.productId, productId)));
    }
  });
  await syncProductDefaultImage(productId);
  await revalidateProductPaths(productId);
}

export async function deleteProductImageAction(formData: FormData) {
  await requireAdmin();
  const imageId = z.string().min(1).parse(formData.get("id"));
  const [row] = await db
    .select()
    .from(productImages)
    .where(eq(productImages.id, imageId));
  if (!row) return;

  await db.delete(productImages).where(eq(productImages.id, imageId));

  const remaining = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, row.productId))
    .orderBy(asc(productImages.position));
  await db.transaction(async (tx) => {
    for (const [position, image] of remaining.entries()) {
      await tx
        .update(productImages)
        .set({ position })
        .where(eq(productImages.id, image.id));
    }
  });
  await syncProductDefaultImage(row.productId);
  await revalidateProductPaths(row.productId);
}
