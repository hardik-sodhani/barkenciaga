import { describe, expect, it } from "vitest";
import { z } from "zod";

/** Mirrors addToCartAction validation in cart.ts */
const addSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
});

/** Mirrors updateCartItemAction validation in cart.ts */
const updateSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().min(0).max(10),
});

/** Mirrors checkoutAction validation in checkout.ts */
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

describe("addToCartAction schema", () => {
  it("accepts a valid variant and quantity", () => {
    expect(
      addSchema.parse({ variantId: "pv_abc", quantity: 2 }),
    ).toEqual({ variantId: "pv_abc", quantity: 2 });
  });

  it("defaults quantity to 1 when omitted", () => {
    expect(addSchema.parse({ variantId: "pv_abc" })).toEqual({
      variantId: "pv_abc",
      quantity: 1,
    });
  });

  it("rejects empty variant ids", () => {
    expect(() => addSchema.parse({ variantId: "", quantity: 1 })).toThrow();
  });

  it("rejects quantities above the cart line cap", () => {
    expect(() =>
      addSchema.parse({ variantId: "pv_abc", quantity: 11 }),
    ).toThrow();
  });
});

describe("updateCartItemAction schema", () => {
  it("allows zero quantity for line removal", () => {
    expect(
      updateSchema.parse({ itemId: "ci_abc", quantity: 0 }),
    ).toEqual({ itemId: "ci_abc", quantity: 0 });
  });

  it("coerces string quantities from form posts", () => {
    expect(
      updateSchema.parse({ itemId: "ci_abc", quantity: "4" }),
    ).toEqual({ itemId: "ci_abc", quantity: 4 });
  });

  it("rejects negative quantities", () => {
    expect(() =>
      updateSchema.parse({ itemId: "ci_abc", quantity: -1 }),
    ).toThrow();
  });
});

describe("checkoutAction schema", () => {
  const validCheckout = {
    email: "buyer@example.com",
    line1: "1 Woof Street",
    city: "New York",
    region: "NY",
    postalCode: "10001",
    country: "US",
    cardNumber: "4242424242424242",
    cardExpiry: "12/28",
    cardCvc: "123",
  };

  it("accepts a complete checkout payload", () => {
    expect(checkoutSchema.parse(validCheckout)).toMatchObject(validCheckout);
  });

  it("rejects malformed email addresses before order creation", () => {
    expect(() =>
      checkoutSchema.parse({ ...validCheckout, email: "not-an-email" }),
    ).toThrow();
  });

  it("rejects card numbers that are too short", () => {
    expect(() =>
      checkoutSchema.parse({ ...validCheckout, cardNumber: "4242" }),
    ).toThrow();
  });

  it("defaults country to US when omitted", () => {
    const { country: _country, ...withoutCountry } = validCheckout;
    expect(checkoutSchema.parse(withoutCountry).country).toBe("US");
  });
});
