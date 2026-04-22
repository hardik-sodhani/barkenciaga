"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/session";

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
