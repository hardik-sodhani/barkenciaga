import "server-only";
import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import {
  cartItems,
  orderItems,
  orders,
  products,
  productVariants,
} from "@/db/schema";
import { shippingCentsFor, taxCentsFor } from "@/lib/cart";

export type CheckoutErrorCode =
  | "EMPTY_CART"
  | "IDEMPOTENCY_CONFLICT"
  | "PAYMENT_FAILED"
  | "SOLD_OUT";

export class CheckoutError extends Error {
  constructor(
    public readonly code: CheckoutErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

export type CheckoutInput = {
  cartId: string;
  idempotencyKey: string;
  userId: string | null;
  email: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  dogName: string | null;
  cardNumber: string;
};

export type CheckoutResult = {
  orderId: string;
  replayed: boolean;
};

type CheckoutDatabase =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];

async function findExistingOrderForCart(
  database: CheckoutDatabase,
  cartId: string,
): Promise<CheckoutResult | null> {
  const [existing] = await database
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.sourceCartId, cartId))
    .orderBy(desc(orders.createdAt))
    .limit(1);

  if (!existing) return null;
  return { orderId: existing.id, replayed: true };
}

async function findExistingOrder(
  database: CheckoutDatabase,
  idempotencyKey: string,
  cartId: string,
): Promise<CheckoutResult | null> {
  const [existing] = await database
    .select({
      id: orders.id,
      sourceCartId: orders.sourceCartId,
    })
    .from(orders)
    .where(eq(orders.idempotencyKey, idempotencyKey))
    .limit(1);

  if (!existing) return null;
  if (existing.sourceCartId !== cartId) {
    throw new CheckoutError(
      "IDEMPOTENCY_CONFLICT",
      "This checkout request is no longer valid. Refresh checkout and try again.",
    );
  }
  return { orderId: existing.id, replayed: true };
}

function authorizePayment(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.endsWith("0002")) {
    throw new CheckoutError(
      "PAYMENT_FAILED",
      "Your payment was declined. Check your card details or try another card.",
    );
  }
}

export async function placeOrder(
  input: CheckoutInput,
  database: CheckoutDatabase = db,
): Promise<CheckoutResult> {
  const replay = await findExistingOrder(
    database,
    input.idempotencyKey,
    input.cartId,
  );
  if (replay) return replay;

  const replayByCart = await findExistingOrderForCart(database, input.cartId);
  if (replayByCart) return replayByCart;

  authorizePayment(input.cardNumber);

  const orderId = `ord_${nanoid(10)}`;
  try {
    return await database.transaction(async (tx) => {
      await tx
        .select({ id: cartItems.id })
        .from(cartItems)
        .where(eq(cartItems.cartId, input.cartId))
        .for("update");

      const lines = await tx
        .select({
          cartItemId: cartItems.id,
          variantId: productVariants.id,
          quantity: cartItems.quantity,
          inventory: productVariants.inventory,
          size: productVariants.size,
          color: productVariants.color,
          productName: products.name,
          productSlug: products.slug,
          unitPriceCents: products.priceCents,
        })
        .from(cartItems)
        .innerJoin(
          productVariants,
          eq(cartItems.variantId, productVariants.id),
        )
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(eq(cartItems.cartId, input.cartId))
        .orderBy(asc(productVariants.id));

      if (lines.length === 0) {
        const existing = await findExistingOrderForCart(tx, input.cartId);
        if (existing) return existing;
        throw new CheckoutError("EMPTY_CART", "Your bag is empty.");
      }

      for (const line of lines) {
        const updated = await tx
          .update(productVariants)
          .set({
            inventory: sql`${productVariants.inventory} - ${line.quantity}`,
            inventoryVersion: sql`${productVariants.inventoryVersion} + 1`,
          })
          .where(
            and(
              eq(productVariants.id, line.variantId),
              gte(productVariants.inventory, line.quantity),
            ),
          )
          .returning({ inventory: productVariants.inventory });

        if (updated.length === 0) {
          throw new CheckoutError(
            "SOLD_OUT",
            `${line.productName} in ${line.size.toUpperCase()} / ${line.color} no longer has enough stock. Update your bag and try again.`,
          );
        }
      }

      const subtotalCents = lines.reduce(
        (sum, line) => sum + line.unitPriceCents * line.quantity,
        0,
      );
      const shippingCents = shippingCentsFor(subtotalCents);
      const taxCents = taxCentsFor(subtotalCents);
      const totalCents = subtotalCents + shippingCents + taxCents;

      await tx.insert(orders).values({
        id: orderId,
        userId: input.userId,
        status: "paid",
        email: input.email,
        subtotalCents,
        shippingCents,
        taxCents,
        totalCents,
        shippingAddress: input.shippingAddress,
        dogName: input.dogName,
        idempotencyKey: input.idempotencyKey,
        sourceCartId: input.cartId,
      });

      await tx.insert(orderItems).values(
        lines.map((line) => ({
          id: `oi_${nanoid(10)}`,
          orderId,
          variantId: line.variantId,
          productName: line.productName,
          productSlug: line.productSlug,
          variantLabel: `${line.size.toUpperCase()} / ${line.color}`,
          unitPriceCents: line.unitPriceCents,
          quantity: line.quantity,
        })),
      );

      await tx.delete(cartItems).where(eq(cartItems.cartId, input.cartId));
      return { orderId, replayed: false };
    });
  } catch (error) {
    const existing =
      (await findExistingOrder(
        database,
        input.idempotencyKey,
        input.cartId,
      )) ?? (await findExistingOrderForCart(database, input.cartId));
    if (existing) return existing;
    throw error;
  }
}
