"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { nanoid } from "nanoid";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { ensureDbReady } from "@/db/bootstrap";
import { getSession } from "@/lib/session";

const addressSchema = z.object({
  label: z.string().max(60).optional(),
  line1: z.string().min(1, "Street address is required").max(120),
  line2: z.string().max(120).optional(),
  city: z.string().min(1, "City is required").max(80),
  region: z.string().min(1, "State / region is required").max(80),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().min(2).max(2).default("US"),
  isDefault: z.boolean().default(false),
});

function parseAddressForm(formData: FormData) {
  return addressSchema.parse({
    label: formData.get("label") || undefined,
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode"),
    country: (formData.get("country") as string | null)?.toUpperCase() || "US",
    isDefault: formData.get("isDefault") === "on" || formData.get("isDefault") === "true",
  });
}

export async function createAddressAction(formData: FormData) {
  await ensureDbReady();
  const session = await getSession();
  if (!session.userId) throw new Error("Sign in required");
  const userId = session.userId;

  const parsed = parseAddressForm(formData);
  const id = `addr_${nanoid(10)}`;

  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: addresses.id })
      .from(addresses)
      .where(eq(addresses.userId, userId));
    // First address is always the default; otherwise honor the checkbox.
    const makeDefault = parsed.isDefault || existing.length === 0;

    if (makeDefault) {
      await tx
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId));
    }

    await tx.insert(addresses).values({
      id,
      userId,
      label: parsed.label ?? null,
      line1: parsed.line1,
      line2: parsed.line2 ?? null,
      city: parsed.city,
      region: parsed.region,
      postalCode: parsed.postalCode,
      country: parsed.country,
      isDefault: makeDefault,
    });
  });

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  redirect("/account/addresses");
}

export async function updateAddressAction(formData: FormData) {
  await ensureDbReady();
  const session = await getSession();
  if (!session.userId) throw new Error("Sign in required");
  const userId = session.userId;

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing address id");
  const parsed = parseAddressForm(formData);

  await db.transaction(async (tx) => {
    const [owned] = await tx
      .select({ id: addresses.id, isDefault: addresses.isDefault })
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
    if (!owned) throw new Error("Address not found");

    // Keep an address default if it already was; only promote on explicit opt-in.
    const makeDefault = parsed.isDefault || owned.isDefault;
    if (makeDefault) {
      await tx
        .update(addresses)
        .set({ isDefault: false })
        .where(and(eq(addresses.userId, userId), ne(addresses.id, id)));
    }

    await tx
      .update(addresses)
      .set({
        label: parsed.label ?? null,
        line1: parsed.line1,
        line2: parsed.line2 ?? null,
        city: parsed.city,
        region: parsed.region,
        postalCode: parsed.postalCode,
        country: parsed.country,
        isDefault: makeDefault,
      })
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
  });

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  redirect("/account/addresses");
}

export async function deleteAddressAction(formData: FormData) {
  await ensureDbReady();
  const session = await getSession();
  if (!session.userId) throw new Error("Sign in required");
  const userId = session.userId;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.transaction(async (tx) => {
    const [removed] = await tx
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .returning({ wasDefault: addresses.isDefault });

    // If we removed the default, promote another address so the customer
    // always has a default available at checkout.
    if (removed?.wasDefault) {
      const [next] = await tx
        .select({ id: addresses.id })
        .from(addresses)
        .where(eq(addresses.userId, userId))
        .limit(1);
      if (next) {
        await tx
          .update(addresses)
          .set({ isDefault: true })
          .where(and(eq(addresses.id, next.id), eq(addresses.userId, userId)));
      }
    }
  });

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}

export async function setDefaultAddressAction(formData: FormData) {
  await ensureDbReady();
  const session = await getSession();
  if (!session.userId) throw new Error("Sign in required");
  const userId = session.userId;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.transaction(async (tx) => {
    const [owned] = await tx
      .select({ id: addresses.id })
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
    if (!owned) throw new Error("Address not found");

    await tx
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));
    await tx
      .update(addresses)
      .set({ isDefault: true })
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
  });

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}
