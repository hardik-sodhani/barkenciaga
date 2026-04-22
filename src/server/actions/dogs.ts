"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { dogs } from "@/db/schema";
import { ensureDbReady } from "@/db/bootstrap";
import { getSession, setActiveDog } from "@/lib/session";

const dogSchema = z.object({
  name: z.string().min(1).max(60),
  breed: z.string().min(1).max(80),
  gender: z.enum(["male", "female"]),
  sizeBucket: z.enum(["xs", "s", "m", "l", "xl"]),
  neckCm: z.coerce.number().int().min(10).max(120).optional(),
  chestCm: z.coerce.number().int().min(10).max(200).optional(),
  backCm: z.coerce.number().int().min(10).max(200).optional(),
  weightKg: z.coerce.number().int().min(1).max(100).optional(),
});

export async function createDogAction(formData: FormData) {
  await ensureDbReady();
  const session = await getSession();
  if (!session.userId) throw new Error("Sign in required");

  const parsed = dogSchema.parse({
    name: formData.get("name"),
    breed: formData.get("breed"),
    gender: formData.get("gender"),
    sizeBucket: formData.get("sizeBucket"),
    neckCm: formData.get("neckCm") || undefined,
    chestCm: formData.get("chestCm") || undefined,
    backCm: formData.get("backCm") || undefined,
    weightKg: formData.get("weightKg") || undefined,
  });

  const id = `dog_${nanoid(10)}`;
  await db.insert(dogs).values({ id, userId: session.userId, ...parsed });
  await setActiveDog(id);

  revalidatePath("/account/dogs");
  revalidatePath("/", "layout");
  redirect("/account/dogs");
}

export async function deleteDogAction(formData: FormData) {
  const session = await getSession();
  if (!session.userId) throw new Error("Sign in required");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db
    .delete(dogs)
    .where(and(eq(dogs.id, id), eq(dogs.userId, session.userId)));
  revalidatePath("/account/dogs");
  revalidatePath("/", "layout");
}

export async function updateDogAction(formData: FormData) {
  const session = await getSession();
  if (!session.userId) throw new Error("Sign in required");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing dog id");
  const parsed = dogSchema.parse({
    name: formData.get("name"),
    breed: formData.get("breed"),
    gender: formData.get("gender"),
    sizeBucket: formData.get("sizeBucket"),
    neckCm: formData.get("neckCm") || undefined,
    chestCm: formData.get("chestCm") || undefined,
    backCm: formData.get("backCm") || undefined,
    weightKg: formData.get("weightKg") || undefined,
  });
  await db
    .update(dogs)
    .set(parsed)
    .where(and(eq(dogs.id, id), eq(dogs.userId, session.userId)));
  revalidatePath("/account/dogs");
}
