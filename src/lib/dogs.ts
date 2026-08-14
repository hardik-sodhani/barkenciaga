import "server-only";
import { db } from "@/db";
import { dogs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";
import { getSession } from "./session";

export const BREED_SIZE_HINTS: Record<
  string,
  "xs" | "s" | "m" | "l" | "xl"
> = {
  Chihuahua: "xs",
  "Yorkshire Terrier": "xs",
  Pomeranian: "xs",
  Dachshund: "s",
  "Jack Russell Terrier": "s",
  "French Bulldog": "m",
  Beagle: "m",
  "Cocker Spaniel": "m",
  Corgi: "m",
  "Border Collie": "l",
  "Golden Retriever": "l",
  "Labrador Retriever": "l",
  "Standard Poodle": "l",
  "Bernese Mountain Dog": "xl",
  "Great Dane": "xl",
  "Saint Bernard": "xl",
};

export const BREEDS = Object.keys(BREED_SIZE_HINTS);

export async function getDogsForUser(userId: string) {
  await ensureDbReady();
  return db.select().from(dogs).where(eq(dogs.userId, userId));
}

export async function getDogById(dogId: string) {
  await ensureDbReady();
  const [row] = await db.select().from(dogs).where(eq(dogs.id, dogId));
  return row ?? null;
}

export async function getActiveDog() {
  const s = await getSession();
  if (!s.activeDogId || !s.userId) return null;
  await ensureDbReady();
  const [row] = await db
    .select()
    .from(dogs)
    .where(and(eq(dogs.id, s.activeDogId), eq(dogs.userId, s.userId)));
  return row ?? null;
}

export function recommendSizeForDog(
  dog: { sizeBucket: "xs" | "s" | "m" | "l" | "xl" },
  availableSizes: Array<"xs" | "s" | "m" | "l" | "xl">,
): "xs" | "s" | "m" | "l" | "xl" | null {
  if (availableSizes.includes(dog.sizeBucket)) return dog.sizeBucket;
  const order: Array<"xs" | "s" | "m" | "l" | "xl"> = ["xs", "s", "m", "l", "xl"];
  const idx = order.indexOf(dog.sizeBucket);
  if (idx < 0) return null;
  // Prefer sizing up over down when the dog's exact size is unavailable.
  for (let d = 1; d < order.length; d++) {
    const up = order[idx + d];
    if (up && availableSizes.includes(up)) return up;
    const down = order[idx - d];
    if (down && availableSizes.includes(down)) return down;
  }
  return null;
}
