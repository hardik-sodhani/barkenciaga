import { describe, expect, it, vi, beforeEach } from "vitest";
import { computePersistedOrderTotals } from "@/lib/checkout-totals";

const mocks = vi.hoisted(() => ({
  ensureDbReady: vi.fn(),
  getCart: vi.fn(),
  clearCart: vi.fn(),
  getSession: vi.fn(),
  getActiveDog: vi.fn(),
  transaction: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
  nanoid: vi.fn(),
}));

vi.mock("@/db/bootstrap", () => ({ ensureDbReady: mocks.ensureDbReady }));
vi.mock("@/lib/cart", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/cart")>();
  return {
    ...actual,
    getCart: mocks.getCart,
    clearCart: mocks.clearCart,
  };
});
vi.mock("@/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/lib/dogs", () => ({ getActiveDog: mocks.getActiveDog }));
vi.mock("@/db", () => ({ db: { transaction: mocks.transaction } }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("nanoid", () => ({ nanoid: mocks.nanoid }));

import { checkoutAction } from "./checkout";

const sampleLine = {
  id: "ci_1",
  variantId: "pv_1",
  quantity: 2,
  unitPriceCents: 7500,
  lineTotalCents: 15000,
  product: {
    id: "p1",
    slug: "monogram-quilted-coat",
    name: "Monogram Quilted Coat",
    subtitle: null,
    basePalette: { a: "#1a1a1a", b: "#f5f5f5" },
    imagePath: null,
  },
  variant: {
    size: "m",
    color: "Ink",
    colorHex: "#1a1a1a",
    sku: "BRK-MONO-M-INK",
    inventory: 8,
  },
};

function checkoutForm(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const defaults = {
    email: "buyer@example.com",
    line1: "1 Woof Street",
    city: "New York",
    region: "NY",
    postalCode: "10001",
    country: "US",
    cardNumber: "4242424242424242",
    cardExpiry: "12/29",
    cardCvc: "123",
  };
  for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
    fd.set(key, value);
  }
  return fd;
}

describe("checkoutAction", () => {
  let insertedOrder: Record<string, unknown> | undefined;
  let insertedItems: unknown[] | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    insertedOrder = undefined;
    insertedItems = undefined;

    mocks.ensureDbReady.mockResolvedValue(undefined);
    mocks.getCart.mockResolvedValue({
      cartId: "cart_test",
      subtotalCents: 15000,
      itemCount: 2,
      lines: [sampleLine],
    });
    mocks.getSession.mockResolvedValue({
      userId: "user_1",
      userEmail: "buyer@example.com",
      userName: "Buyer",
      userRole: "customer",
      activeDogId: null,
      cartId: "cart_test",
    });
    mocks.getActiveDog.mockResolvedValue(null);
    mocks.clearCart.mockResolvedValue(undefined);
    mocks.nanoid.mockReturnValue("testnanoid01");
    mocks.redirect.mockImplementation((url: string) => {
      throw new Error(`REDIRECT:${url}`);
    });
    mocks.transaction.mockImplementation(async (cb) => {
      const tx = {
        insert: () => ({
          values: (data: unknown) => {
            if (insertedOrder === undefined) {
              insertedOrder = data as Record<string, unknown>;
            } else {
              insertedItems = data as unknown[];
            }
            return Promise.resolve();
          },
        }),
      };
      await cb(tx);
    });
  });

  it("rejects checkout when the cart has no lines", async () => {
    mocks.getCart.mockResolvedValue({
      cartId: "cart_test",
      subtotalCents: 0,
      itemCount: 0,
      lines: [],
    });

    await expect(checkoutAction(checkoutForm())).rejects.toThrow("Cart is empty");
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("persists order totals from computePersistedOrderTotals, not preview math", async () => {
    const subtotalCents = 15000;
    const expected = computePersistedOrderTotals(subtotalCents);

    await expect(checkoutAction(checkoutForm())).rejects.toThrow(
      "REDIRECT:/orders/ord_testnanoid01",
    );

    expect(insertedOrder).toMatchObject({
      id: "ord_testnanoid01",
      userId: "user_1",
      status: "paid",
      email: "buyer@example.com",
      subtotalCents: expected.subtotalCents,
      shippingCents: expected.shippingCents,
      taxCents: expected.taxCents,
      totalCents: expected.totalCents,
      shippingAddress: {
        line1: "1 Woof Street",
        city: "New York",
        region: "NY",
        postalCode: "10001",
        country: "US",
      },
      dogName: null,
    });
  });

  it("writes one order item row per cart line before clearing the cart", async () => {
    await expect(checkoutAction(checkoutForm())).rejects.toThrow(/^REDIRECT:/);

    expect(insertedItems).toEqual([
      {
        id: "oi_testnanoid01",
        orderId: "ord_testnanoid01",
        variantId: "pv_1",
        productName: "Monogram Quilted Coat",
        productSlug: "monogram-quilted-coat",
        variantLabel: "M / Ink",
        unitPriceCents: 7500,
        quantity: 2,
      },
    ]);
    expect(mocks.clearCart).toHaveBeenCalledOnce();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/cart");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/account");
  });

  it("rejects invalid checkout payloads before touching the database", async () => {
    await expect(
      checkoutAction(checkoutForm({ email: "not-an-email" })),
    ).rejects.toThrow();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
});
