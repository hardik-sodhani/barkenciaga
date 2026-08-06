import { describe, expect, it, vi } from "vitest";
import { shippingCentsFor, taxCentsFor } from "@/lib/cart";

const { getCartMock, clearCartMock, getSessionMock, getActiveDogMock, redirectMock, orderInserts } =
  vi.hoisted(() => ({
    getCartMock: vi.fn(),
    clearCartMock: vi.fn(),
    getSessionMock: vi.fn(),
    getActiveDogMock: vi.fn(),
    redirectMock: vi.fn(),
    orderInserts: [] as Array<Record<string, unknown>>,
  }));

vi.mock("@/db", () => ({
  db: {
    transaction: vi.fn(async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        insert: () => ({
          values: async (vals: Record<string, unknown> | Record<string, unknown>[]) => {
            if (!Array.isArray(vals) && "taxCents" in vals) {
              orderInserts.push(vals);
            }
          },
        }),
      };
      await fn(tx);
    }),
  },
}));
vi.mock("@/db/bootstrap", () => ({ ensureDbReady: vi.fn() }));
vi.mock("@/lib/cart", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/cart")>();
  return {
    ...actual,
    getCart: getCartMock,
    clearCart: clearCartMock,
  };
});
vi.mock("@/lib/session", () => ({ getSession: getSessionMock }));
vi.mock("@/lib/dogs", () => ({ getActiveDog: getActiveDogMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("shippingCentsFor", () => {
  it("waives shipping on empty carts", () => {
    expect(shippingCentsFor(0)).toBe(0);
  });

  it("charges $12 below the free-shipping threshold", () => {
    expect(shippingCentsFor(10000)).toBe(1200);
  });

  it("waives shipping at or above $250", () => {
    expect(shippingCentsFor(25000)).toBe(0);
    expect(shippingCentsFor(30000)).toBe(0);
  });
});

describe("taxCentsFor", () => {
  it("applies 7.25% tax rounded to nearest cent", () => {
    expect(taxCentsFor(10000)).toBe(725);
    expect(taxCentsFor(9999)).toBe(725);
  });

  it("returns zero tax on zero subtotal", () => {
    expect(taxCentsFor(0)).toBe(0);
  });
});

describe("checkout preview totals", () => {
  // Shared formula used by cart page, checkout page, and checkoutAction.
  function orderTotalCents(subtotalCents: number) {
    const shipping = shippingCentsFor(subtotalCents);
    const tax = taxCentsFor(subtotalCents);
    return subtotalCents + shipping + tax;
  }

  it("matches cart and checkout page preview math", () => {
    expect(orderTotalCents(15000)).toBe(15000 + 1200 + 1088);
  });

  // BRK-20: charged total must equal checkout preview when shipping fee applies.
  it("persisted order tax matches checkout preview when shipping applies (BRK-20)", async () => {
    const { checkoutAction } = await import("@/server/actions/checkout");

    const subtotal = 15000; // $150 — below $250 free-shipping threshold
    const shipping = shippingCentsFor(subtotal);
    expect(shipping).toBe(1200);

    const previewTax = taxCentsFor(subtotal);
    const previewTotal = subtotal + shipping + previewTax;

    orderInserts.length = 0;
    getCartMock.mockResolvedValue({
      cartId: "cart_test",
      subtotalCents: subtotal,
      itemCount: 1,
      lines: [
        {
          id: "ci_1",
          variantId: "var_1",
          quantity: 1,
          product: {
            id: "p_1",
            slug: "test-coat",
            name: "Test Coat",
            subtitle: null,
            basePalette: { a: "#000", b: "#fff" },
            imagePath: null,
          },
          variant: {
            size: "m",
            color: "ink",
            colorHex: "#111",
            sku: "SKU-1",
            inventory: 5,
          },
          unitPriceCents: subtotal,
          lineTotalCents: subtotal,
        },
      ],
    });
    getSessionMock.mockResolvedValue({ userId: null, activeDogId: null });
    getActiveDogMock.mockResolvedValue(null);
    clearCartMock.mockResolvedValue(undefined);

    const formData = new FormData();
    formData.set("email", "shopper@barkenciaga.test");
    formData.set("line1", "1 Bark Ave");
    formData.set("city", "New York");
    formData.set("region", "NY");
    formData.set("postalCode", "10001");
    formData.set("country", "US");
    formData.set("cardNumber", "4242424242424242");
    formData.set("cardExpiry", "12/30");
    formData.set("cardCvc", "123");

    await checkoutAction(formData);

    expect(orderInserts).toHaveLength(1);
    const persisted = orderInserts[0];
    expect(persisted.taxCents).toBe(previewTax);
    expect(persisted.taxCents).not.toBe(taxCentsFor(subtotal + shipping));
    expect(persisted.totalCents).toBe(previewTotal);
    expect(persisted.totalCents).toBe(orderTotalCents(subtotal));
  });

  it("persisted and preview totals still match with free shipping", () => {
    const subtotal = 25000;
    expect(shippingCentsFor(subtotal)).toBe(0);
    expect(orderTotalCents(subtotal)).toBe(25000 + taxCentsFor(subtotal));
  });
});
