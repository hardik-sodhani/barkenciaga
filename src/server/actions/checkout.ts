"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  orders,
  orderItems,
  promoCodes,
  promoRedemptions,
} from "@/db/schema";
import { getCart, clearCart, getCartTotals } from "@/lib/cart";
import { getSession, setPromoCodeId } from "@/lib/session";
import { getActiveDog } from "@/lib/dogs";
import { ensureDbReady } from "@/db/bootstrap";
import { validatePromo } from "@/lib/promos";

const checkoutSchema = z.object({
  email: z.email(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default("US"),
  cardNumber: z.string().min(12).max(30),
  cardExpiry: z.string().min(4).max(10),
  cardCvc: z.string().min(3).max(4),
});

export async function checkoutAction(formData: FormData) {
  await ensureDbReady();
  const parsed = checkoutSchema.parse({
    email: formData.get("email"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "US",
    cardNumber: formData.get("cardNumber"),
    cardExpiry: formData.get("cardExpiry"),
    cardCvc: formData.get("cardCvc"),
  });

  const cart = await getCart();
  if (cart.lines.length === 0) {
    throw new Error("Cart is empty");
  }

  const session = await getSession();
  const dog = await getActiveDog();

  const subtotalCents = cart.subtotalCents;
  const promoResult = session.promoCodeId
    ? await validatePromo({
        promoId: session.promoCodeId,
        userId: session.userId,
        subtotalCents,
      })
    : null;
  if (promoResult && !promoResult.ok) {
    throw new Error(
      `Applied promo is no longer valid (${promoResult.reason.replaceAll("_", " ")})`,
    );
  }
  const totals = getCartTotals(
    subtotalCents,
    promoResult?.ok ? promoResult.discountCents : 0,
  );

  const orderId = `ord_${nanoid(10)}`;

  await db.transaction(async (tx) => {
    await tx.insert(orders).values({
      id: orderId,
      userId: session.userId ?? null,
      status: "paid",
      email: parsed.email,
      subtotalCents,
      shippingCents: totals.shippingCents,
      taxCents: totals.taxCents,
      promoCode: promoResult?.ok ? promoResult.promo.code : null,
      discountCents: totals.discountCents,
      totalCents: totals.totalCents,
      shippingAddress: {
        line1: parsed.line1,
        line2: parsed.line2,
        city: parsed.city,
        region: parsed.region,
        postalCode: parsed.postalCode,
        country: parsed.country,
      },
      dogName: dog?.name ?? null,
    });

    await tx.insert(orderItems).values(
      cart.lines.map((l) => ({
        id: `oi_${nanoid(10)}`,
        orderId,
        variantId: l.variantId,
        productName: l.product.name,
        productSlug: l.product.slug,
        variantLabel: `${l.variant.size.toUpperCase()} / ${l.variant.color}`,
        unitPriceCents: l.unitPriceCents,
        quantity: l.quantity,
      })),
    );

    if (promoResult?.ok) {
      await tx.insert(promoRedemptions).values({
        id: `pr_${nanoid(10)}`,
        promoId: promoResult.promo.id,
        userId: session.userId,
        orderId,
      });
      await tx
        .update(promoCodes)
        .set({
          redemptionsCount: sql`${promoCodes.redemptionsCount} + 1`,
        })
        .where(eq(promoCodes.id, promoResult.promo.id));
    }
  });

  await clearCart();
  await setPromoCodeId(null);
  console.log(`[barkenciaga] order ${orderId} confirmed for ${parsed.email}`);

  revalidatePath("/cart");
  revalidatePath("/account");
  redirect(`/orders/${orderId}`);
}
