import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import {
  cartItems,
  carts,
  categories,
  orderItems,
  orders,
  products,
  productVariants,
} from "@/db/schema";
import { CheckoutError, placeOrder, type CheckoutInput } from "@/lib/checkout";
import { setInventory } from "@/lib/inventory";
import { addCartItemWithInventoryGuard } from "@/lib/cart-inventory";

let client: PGlite;
let testDb: ReturnType<typeof drizzle<typeof schema>>;

const input = (cartId: string, idempotencyKey: string): CheckoutInput => ({
  cartId,
  idempotencyKey,
  userId: null,
  email: "shopper@example.com",
  shippingAddress: {
    line1: "12 Runway Ave",
    city: "New York",
    region: "NY",
    postalCode: "10001",
    country: "US",
  },
  dogName: null,
  cardNumber: "4242424242424242",
});

async function addCart(cartId: string, items: Array<[string, number]>) {
  await testDb.insert(carts).values({ id: cartId });
  if (items.length === 0) return;
  await testDb.insert(cartItems).values(
    items.map(([variantId, quantity], index) => ({
      id: `${cartId}_item_${index}`,
      cartId,
      variantId,
      quantity,
    })),
  );
}

async function inventoryFor(variantId: string) {
  const [variant] = await testDb
    .select({ inventory: productVariants.inventory })
    .from(productVariants)
    .where(eq(productVariants.id, variantId));
  return variant.inventory;
}

beforeEach(async () => {
  client = new PGlite();
  testDb = drizzle(client, { schema });
  await client.exec(`
    CREATE TABLE categories (
      id text PRIMARY KEY,
      slug text NOT NULL UNIQUE,
      name text NOT NULL,
      tagline text,
      hero_copy text,
      sort_order integer NOT NULL DEFAULT 0
    );
    CREATE TABLE products (
      id text PRIMARY KEY,
      slug text NOT NULL UNIQUE,
      name text NOT NULL,
      subtitle text,
      description text NOT NULL,
      category_id text NOT NULL REFERENCES categories(id),
      brand_line text NOT NULL DEFAULT 'Barkenciaga',
      price_cents integer NOT NULL,
      base_palette jsonb NOT NULL,
      image_path text,
      editorial_copy text,
      care_copy text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE product_variants (
      id text PRIMARY KEY,
      product_id text NOT NULL REFERENCES products(id),
      size text NOT NULL,
      color text NOT NULL,
      color_hex text NOT NULL,
      sku text NOT NULL UNIQUE,
      inventory integer NOT NULL DEFAULT 0,
      inventory_version integer NOT NULL DEFAULT 0
    );
    CREATE TABLE carts (
      id text PRIMARY KEY,
      user_id text,
      dog_id text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE cart_items (
      id text PRIMARY KEY,
      cart_id text NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      variant_id text NOT NULL REFERENCES product_variants(id),
      quantity integer NOT NULL DEFAULT 1,
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (cart_id, variant_id)
    );
    CREATE TABLE orders (
      id text PRIMARY KEY,
      user_id text,
      status text NOT NULL DEFAULT 'pending',
      email text NOT NULL,
      subtotal_cents integer NOT NULL,
      shipping_cents integer NOT NULL DEFAULT 0,
      tax_cents integer NOT NULL DEFAULT 0,
      total_cents integer NOT NULL,
      shipping_address jsonb,
      dog_name text,
      idempotency_key text UNIQUE,
      source_cart_id text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE order_items (
      id text PRIMARY KEY,
      order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      variant_id text NOT NULL REFERENCES product_variants(id),
      product_name text NOT NULL,
      product_slug text NOT NULL,
      variant_label text NOT NULL,
      unit_price_cents integer NOT NULL,
      quantity integer NOT NULL
    );
  `);
  await testDb.insert(categories).values({
    id: "category",
    slug: "couture",
    name: "Couture",
  });
  await testDb.insert(products).values({
    id: "product",
    slug: "launch-coat",
    name: "Launch Coat",
    description: "A coat.",
    categoryId: "category",
    priceCents: 10000,
    basePalette: { a: "#000", b: "#fff" },
  });
  await testDb.insert(productVariants).values([
    {
      id: "variant_m",
      productId: "product",
      size: "m",
      color: "Ink",
      colorHex: "#000",
      sku: "LAUNCH-M",
      inventory: 1,
    },
    {
      id: "variant_l",
      productId: "product",
      size: "l",
      color: "Ink",
      colorHex: "#000",
      sku: "LAUNCH-L",
      inventory: 0,
    },
  ]);
});

afterEach(async () => {
  await client.close();
});

describe("placeOrder", () => {
  it("allows only one concurrent purchase of the last unit", async () => {
    await addCart("cart_a", [["variant_m", 1]]);
    await addCart("cart_b", [["variant_m", 1]]);

    const results = await Promise.allSettled([
      placeOrder(input("cart_a", "checkout_concurrent_a"), testDb),
      placeOrder(input("cart_b", "checkout_concurrent_b"), testDb),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    const rejection = results.find((result) => result.status === "rejected");
    expect(rejection).toMatchObject({
      reason: expect.objectContaining({ code: "SOLD_OUT" }),
    });
    expect(await inventoryFor("variant_m")).toBe(0);
    expect(await testDb.select().from(orders)).toHaveLength(1);
  });

  it("rolls back every inventory change when one line is sold out", async () => {
    await addCart("cart_rollback", [
      ["variant_m", 1],
      ["variant_l", 1],
    ]);

    await expect(
      placeOrder(input("cart_rollback", "checkout_rollback"), testDb),
    ).rejects.toMatchObject({ code: "SOLD_OUT" });

    expect(await inventoryFor("variant_m")).toBe(1);
    expect(await testDb.select().from(orders)).toHaveLength(0);
    expect(await testDb.select().from(orderItems)).toHaveLength(0);
    expect(await testDb.select().from(cartItems)).toHaveLength(2);
  });

  it("replays a successful checkout without duplicating the order", async () => {
    await addCart("cart_retry", [["variant_m", 1]]);
    const checkoutInput = input("cart_retry", "checkout_retry_safe");

    const first = await placeOrder(checkoutInput, testDb);
    const retry = await placeOrder(checkoutInput, testDb);

    expect(retry).toEqual({ orderId: first.orderId, replayed: true });
    expect(await inventoryFor("variant_m")).toBe(0);
    expect(await testDb.select().from(orders)).toHaveLength(1);
    expect(await testDb.select().from(orderItems)).toHaveLength(1);
  });

  it("keeps inventory and the cart intact after a payment failure", async () => {
    await addCart("cart_payment", [["variant_m", 1]]);

    await expect(
      placeOrder(
        {
          ...input("cart_payment", "checkout_payment_failure"),
          cardNumber: "4000000000000002",
        },
        testDb,
      ),
    ).rejects.toEqual(
      new CheckoutError(
        "PAYMENT_FAILED",
        "Your payment was declined. Check your card details or try another card.",
      ),
    );

    expect(await inventoryFor("variant_m")).toBe(1);
    expect(await testDb.select().from(orders)).toHaveLength(0);
    expect(await testDb.select().from(cartItems)).toHaveLength(1);
  });

  it("rejects a stale admin inventory overwrite after checkout", async () => {
    await addCart("cart_admin_race", [["variant_m", 1]]);

    await placeOrder(
      input("cart_admin_race", "checkout_admin_consistency"),
      testDb,
    );
    const staleUpdate = await setInventory("variant_m", 9, 0, testDb);

    expect(staleUpdate).toBeNull();
    expect(await inventoryFor("variant_m")).toBe(0);
  });
});

describe("cart inventory guards", () => {
  it("does not let concurrent additions exceed available inventory", async () => {
    await addCart("cart_concurrent_add", []);

    const results = await Promise.allSettled([
      addCartItemWithInventoryGuard(
        "cart_concurrent_add",
        "variant_m",
        1,
        testDb,
      ),
      addCartItemWithInventoryGuard(
        "cart_concurrent_add",
        "variant_m",
        1,
        testDb,
      ),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.find((result) => result.status === "rejected")).toMatchObject({
      reason: expect.objectContaining({ name: "CartInventoryError" }),
    });
    const [line] = await testDb.select().from(cartItems);
    expect(line.quantity).toBe(1);
  });
});
