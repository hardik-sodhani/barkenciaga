import "server-only";
import { db } from "@/db";
import { carts, cartItems, productVariants, products } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ensureCartId, getSession, readCartId } from "./session";
import { ensureDbReady } from "@/db/bootstrap";

export type CartLine = {
  id: string;
  variantId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    subtitle: string | null;
    basePalette: { a: string; b: string };
    imagePath: string | null;
  };
  variant: {
    size: string;
    color: string;
    colorHex: string;
    sku: string;
    inventory: number;
  };
  unitPriceCents: number;
  lineTotalCents: number;
};

async function ensureCartRow(cartId: string) {
  const [existing] = await db.select().from(carts).where(eq(carts.id, cartId));
  if (existing) return existing;
  const session = await getSession();
  const [inserted] = await db
    .insert(carts)
    .values({
      id: cartId,
      userId: session.userId ?? null,
      dogId: session.activeDogId ?? null,
    })
    .returning();
  return inserted;
}

// DEMO-TODO: three sequential SELECTs (items, variants, products) = classic
// N+1 shape. Collapse into a single Drizzle relational query or a JOIN and
// keep the public return shape identical. See TECH_DEBT.md item 6.
export async function getCart() {
  await ensureDbReady();
  const cartId = await readCartId();
  if (!cartId) {
    return { cartId: null, lines: [] as CartLine[], subtotalCents: 0, itemCount: 0 };
  }

  const itemRows = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cartId));

  if (itemRows.length === 0) {
    return { cartId, lines: [] as CartLine[], subtotalCents: 0, itemCount: 0 };
  }

  const variantIds = itemRows.map((i) => i.variantId);
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.id, variantIds));
  const productIds = Array.from(new Set(variantRows.map((v) => v.productId)));
  const productRows = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const variantMap = new Map(variantRows.map((v) => [v.id, v]));
  const productMap = new Map(productRows.map((p) => [p.id, p]));

  const lines: CartLine[] = [];
  for (const it of itemRows) {
    const variant = variantMap.get(it.variantId);
    if (!variant) continue;
    const product = productMap.get(variant.productId);
    if (!product) continue;
    lines.push({
      id: it.id,
      variantId: variant.id,
      quantity: it.quantity,
      product: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        basePalette: product.basePalette,
        imagePath: product.imagePath,
      },
      variant: {
        size: variant.size,
        color: variant.color,
        colorHex: variant.colorHex,
        sku: variant.sku,
        inventory: variant.inventory,
      },
      unitPriceCents: product.priceCents,
      lineTotalCents: product.priceCents * it.quantity,
    });
  }

  const subtotalCents = lines.reduce((s, l) => s + l.lineTotalCents, 0);
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);

  return { cartId, lines, subtotalCents, itemCount };
}

export async function getCartSummary() {
  try {
    const { itemCount, subtotalCents } = await getCart();
    return { itemCount, subtotalCents };
  } catch {
    return { itemCount: 0, subtotalCents: 0 };
  }
}

export async function addToCart(variantId: string, quantity = 1) {
  await ensureDbReady();
  const cartId = await ensureCartId();
  await ensureCartRow(cartId);

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.variantId, variantId)));

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
    return;
  }

  await db.insert(cartItems).values({
    id: `ci_${nanoid(10)}`,
    cartId,
    variantId,
    quantity,
  });
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  await ensureDbReady();
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    return;
  }
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
}

export async function removeCartItem(itemId: string) {
  await ensureDbReady();
  await db.delete(cartItems).where(eq(cartItems.id, itemId));
}

export async function clearCart() {
  await ensureDbReady();
  const cartId = await readCartId();
  if (!cartId) return;
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

export function shippingCentsFor(subtotalCents: number) {
  if (subtotalCents === 0) return 0;
  if (subtotalCents >= 25000) return 0;
  return 1200;
}

export function taxCentsFor(subtotalCents: number) {
  return Math.round(subtotalCents * 0.0725);
}
