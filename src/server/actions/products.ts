"use server";

import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { and, asc, eq, max } from "drizzle-orm";
import { db } from "@/db";
import { productImages, products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { isCompleteImageOrder } from "@/lib/product-gallery";

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


const productImageTargetSchema = z.object({
  productId: z.string().min(1).max(80),
});

const imageTypeExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

function hasValidImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return signature.every((byte, index) => bytes[index] === byte);
  }
  if (mimeType === "image/webp") {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }
  return false;
}

function revalidateProductImages() {
  revalidatePath("/admin");
  revalidatePath("/p/[slug]", "page");
}

export async function uploadProductImageAction(formData: FormData) {
  await requireAdmin();
  const { productId } = productImageTargetSchema.parse({
    productId: formData.get("productId"),
  });
  const alt = z.string().trim().min(1).max(240).parse(formData.get("alt"));
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose an image to upload");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be 10 MB or smaller");
  }

  const extension = imageTypeExtensions[file.type as keyof typeof imageTypeExtensions];
  if (!extension) {
    throw new Error("Upload a JPEG, PNG, or WebP image");
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidImageSignature(bytes, file.type)) {
    throw new Error("The uploaded file is not a valid image");
  }

  const filename = `${productId}-${nanoid(12)}.${extension}`;
  const uploadDirectory = path.join(process.cwd(), "public", "products", "uploads");
  const diskPath = path.join(uploadDirectory, filename);
  const publicPath = `/products/uploads/${filename}`;
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(diskPath, bytes);

  try {
    await db.transaction(async (tx) => {
      const [product] = await tx
        .select({ id: products.id })
        .from(products)
        .where(eq(products.id, productId));
      if (!product) throw new Error("Product not found");

      const [lastPosition] = await tx
        .select({ value: max(productImages.position) })
        .from(productImages)
        .where(eq(productImages.productId, productId));
      const position = (lastPosition?.value ?? -1) + 1;

      await tx.insert(productImages).values({
        id: `img_${nanoid(12)}`,
        productId,
        path: publicPath,
        alt,
        position,
      });
      if (position === 0) {
        await tx
          .update(products)
          .set({ imagePath: publicPath })
          .where(eq(products.id, productId));
      }
    });
  } catch (error) {
    await unlink(diskPath).catch(() => undefined);
    throw error;
  }

  revalidateProductImages();
}

const reorderProductImagesSchema = z.object({
  productId: z.string().min(1).max(80),
  imageIds: z.array(z.string().min(1).max(80)).max(100),
});

export async function reorderProductImagesAction(input: {
  productId: string;
  imageIds: string[];
}) {
  await requireAdmin();
  const { productId, imageIds } = reorderProductImagesSchema.parse(input);

  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: productImages.id, path: productImages.path })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.position), asc(productImages.id));
    if (!isCompleteImageOrder(existing.map((image) => image.id), imageIds)) {
      throw new Error("Image order must contain every product image exactly once");
    }

    for (const [position, id] of imageIds.entries()) {
      await tx
        .update(productImages)
        .set({ position })
        .where(and(eq(productImages.id, id), eq(productImages.productId, productId)));
    }
    const firstImage = existing.find((image) => image.id === imageIds[0]);
    await tx
      .update(products)
      .set({ imagePath: firstImage?.path ?? null })
      .where(eq(products.id, productId));
  });

  revalidateProductImages();
}

export async function deleteProductImageAction(input: {
  productId: string;
  imageId: string;
}) {
  await requireAdmin();
  const productId = z.string().min(1).max(80).parse(input.productId);
  const imageId = z.string().min(1).max(80).parse(input.imageId);

  const deletedPath = await db.transaction(async (tx) => {
    const [image] = await tx
      .select()
      .from(productImages)
      .where(and(eq(productImages.id, imageId), eq(productImages.productId, productId)));
    if (!image) throw new Error("Product image not found");

    await tx
      .delete(productImages)
      .where(and(eq(productImages.id, imageId), eq(productImages.productId, productId)));
    const remaining = await tx
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.position), asc(productImages.id));
    for (const [position, remainingImage] of remaining.entries()) {
      await tx
        .update(productImages)
        .set({ position })
        .where(eq(productImages.id, remainingImage.id));
    }
    await tx
      .update(products)
      .set({ imagePath: remaining[0]?.path ?? null })
      .where(eq(products.id, productId));
    return image.path;
  });

  if (deletedPath.startsWith("/products/uploads/")) {
    const filename = path.basename(deletedPath);
    await unlink(path.join(process.cwd(), "public", "products", "uploads", filename)).catch(
      () => undefined,
    );
  }
  revalidateProductImages();
}
