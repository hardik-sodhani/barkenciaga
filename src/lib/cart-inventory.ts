import "server-only";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { cartItems, productVariants } from "@/db/schema";

export class CartInventoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartInventoryError";
  }
}

export async function addCartItemWithInventoryGuard(
  cartId: string,
  variantId: string,
  quantity: number,
  database: typeof db = db,
) {
  await database.transaction(async (tx) => {
    const [variant] = await tx
      .select({ inventory: productVariants.inventory })
      .from(productVariants)
      .where(eq(productVariants.id, variantId))
      .for("update");
    if (!variant) {
      throw new CartInventoryError("This option is no longer available.");
    }

    const [existing] = await tx
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cartId), eq(cartItems.variantId, variantId)),
      )
      .for("update");
    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    if (nextQuantity > variant.inventory) {
      throw new CartInventoryError(
        variant.inventory === 0
          ? "This option just sold out. Choose another size or color."
          : `Only ${variant.inventory} available. Reduce the quantity and try again.`,
      );
    }

    if (existing) {
      await tx
        .update(cartItems)
        .set({ quantity: nextQuantity })
        .where(eq(cartItems.id, existing.id));
      return;
    }

    await tx.insert(cartItems).values({
      id: `ci_${nanoid(10)}`,
      cartId,
      variantId,
      quantity,
    });
  });
}

export async function setCartItemQuantityWithInventoryGuard(
  cartId: string,
  itemId: string,
  quantity: number,
  database: typeof db = db,
) {
  await database.transaction(async (tx) => {
    const [itemPeek] = await tx
      .select({
        variantId: cartItems.variantId,
        quantity: cartItems.quantity,
      })
      .from(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
    if (!itemPeek) return;

    const [variant] = await tx
      .select({ inventory: productVariants.inventory })
      .from(productVariants)
      .where(eq(productVariants.id, itemPeek.variantId))
      .for("update");

    const [item] = await tx
      .select({ quantity: cartItems.quantity })
      .from(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)))
      .for("update");
    if (!item) return;

    if (quantity > item.quantity && (!variant || quantity > variant.inventory)) {
      throw new CartInventoryError(
        "That quantity is no longer available. Refresh your bag and try again.",
      );
    }

    await tx
      .update(cartItems)
      .set({ quantity })
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
  });
}
