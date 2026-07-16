"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, promoCodes, promoRedemptions } from "@/db/schema";
import { getCart, clearCart, shippingCentsFor, taxCentsFor } from "@/lib/cart";
import { getSession, setSessionPromoCodeId } from "@/lib/session";
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
  let discountCents = 0;
  let promoCode: string | null = null;
  let promoId: string | null = null;

  if (session.promoCodeId) {
    const promoResult = await validatePromo({
      promoId: session.promoCodeId,
      userId: session.userId,
      subtotalCents,
    });
    if (!promoResult.ok) {
      await setSessionPromoCodeId(null);
      revalidatePath("/cart");
      revalidatePath("/checkout");
      redirect(`/checkout?promoError=${encodeURIComponent(promoResult.message)}`);
    }
    discountCents = promoResult.discountCents;
    promoCode = promoResult.promo.code;
    promoId = promoResult.promo.id;
  }

  const shippingCents = shippingCentsFor(subtotalCents);
  const taxCents = taxCentsFor(subtotalCents + shippingCents);
  const totalCents = Math.max(0, subtotalCents - discountCents) + shippingCents + taxCents;

  const orderId = `ord_${nanoid(10)}`;

  try {
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id: orderId,
        userId: session.userId ?? null,
        status: "paid",
        email: parsed.email,
        subtotalCents,
        shippingCents,
        taxCents,
        discountCents,
        promoCode,
        totalCents,
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

      if (promoId && promoCode) {
        await tx.insert(promoRedemptions).values({
          id: `pr_${nanoid(10)}`,
          promoId,
          userId: session.userId ?? null,
          orderId,
        });
        await tx
          .update(promoCodes)
          .set({ redemptionsCount: sql`${promoCodes.redemptionsCount} + 1` })
          .where(eq(promoCodes.id, promoId));
      }
    });
  } catch (err) {
    const msg = String((err as { message?: string })?.message ?? err);
    if (/promo_redemptions_promo_user_idx|unique/i.test(msg)) {
      await setSessionPromoCodeId(null);
      revalidatePath("/cart");
      revalidatePath("/checkout");
      redirect(
        `/checkout?promoError=${encodeURIComponent("You’ve already used this promo code.")}`,
      );
    }
    throw err;
  }

  await setSessionPromoCodeId(null);
  await clearCart();
  console.log(`[barkenciaga] order ${orderId} confirmed for ${parsed.email}`);

  revalidatePath("/cart");
  revalidatePath("/account");
  revalidatePath("/admin");
  redirect(`/orders/${orderId}`);
}
