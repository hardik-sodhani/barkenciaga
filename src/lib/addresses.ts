import "server-only";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";

export async function getAddressesForUser(userId: string) {
  await ensureDbReady();
  return db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault), asc(addresses.id));
}

export async function getDefaultAddress(userId: string) {
  await ensureDbReady();
  const [row] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));
  return row ?? null;
}

export async function getAddressForUser(userId: string, addressId: string) {
  await ensureDbReady();
  const [row] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
  return row ?? null;
}
