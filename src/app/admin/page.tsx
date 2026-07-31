import { redirect } from "next/navigation";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import {
  orders,
  products,
  productVariants,
  categories,
  promoCodes,
} from "@/db/schema";
import { ensureDbReady } from "@/db/bootstrap";
import { getSession } from "@/lib/session";
import {
  updateProductAction,
  updateVariantInventoryAction,
} from "@/server/actions/products";
import {
  createPromoAction,
  deactivatePromoAction,
} from "@/server/actions/promo";
import { formatPrice } from "@/lib/utils";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const session = await getSession();
  if (session.userRole !== "admin") {
    redirect("/sign-in");
  }
  await ensureDbReady();

  const [prods, variants, cats, recentOrders, promos] = await Promise.all([
    db.select().from(products),
    db.select().from(productVariants),
    db.select().from(categories),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(20),
    db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt)),
  ]);

  const variantsByProduct = new Map<string, typeof variants>();
  for (const v of variants) {
    if (!variantsByProduct.has(v.productId)) {
      variantsByProduct.set(v.productId, []);
    }
    variantsByProduct.get(v.productId)!.push(v);
  }
  const categoriesById = new Map(cats.map((c) => [c.id, c]));

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="eyebrow mb-2">Studio · admin</div>
          <h1 className="display-lg">Ops</h1>
        </div>
        <div className="text-xs text-ink-60">
          {prods.length} products · {variants.length} variants · {recentOrders.length} recent orders
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl mb-6">Recent orders</h2>
        {recentOrders.length === 0 ? (
          <div className="border border-dashed border-ink-20 p-8 text-sm text-ink-60">
            No orders yet. Place one via /checkout.
          </div>
        ) : (
          <ul className="divide-y divide-ink-20 border-y border-ink-20">
            {recentOrders.map((o) => (
              <li key={o.id} className="grid grid-cols-[1fr_120px_80px_100px_auto] gap-4 py-3 text-sm items-center">
                <div>
                  <div className="font-medium">{o.email}</div>
                  <div className="text-xs text-ink-60">
                    {o.id} · {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-ink-60">
                  {o.dogName ? `for ${o.dogName}` : "—"}
                </div>
                <div className="eyebrow">{o.status}</div>
                <div className="tabular-nums">{formatPrice(o.totalCents)}</div>
                <Link
                  href={`/orders/${o.id}`}
                  className="text-[11px] tracking-[0.2em] uppercase text-ink-60 hover:text-ink"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl mb-6">Promo codes</h2>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
          <div>
            {promos.length === 0 ? (
              <div className="border border-dashed border-ink-20 p-8 text-sm text-ink-60">
                No promo codes yet.
              </div>
            ) : (
              <ul className="divide-y divide-ink-20 border-y border-ink-20">
                {promos.map((promo) => (
                  <li
                    key={promo.id}
                    className="grid gap-3 py-4 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium tracking-wider">{promo.code}</span>
                        <span className="eyebrow">
                          {promo.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-ink-60">
                        {promo.kind === "percent"
                          ? `${promo.valueInt}% off`
                          : `${formatPrice(promo.valueInt)} off`}
                        {" · "}
                        minimum {formatPrice(promo.minSubtotalCents)}
                        {" · "}
                        {promo.redemptionsCount}
                        {promo.maxRedemptions === null
                          ? " redemptions"
                          : ` / ${promo.maxRedemptions} redemptions`}
                      </div>
                    </div>
                    <div className="text-xs text-ink-60">
                      {new Date(promo.startsAt).toLocaleDateString()} —{" "}
                      {promo.endsAt
                        ? new Date(promo.endsAt).toLocaleDateString()
                        : "No expiry"}
                    </div>
                    {promo.active ? (
                      <form action={deactivatePromoAction}>
                        <input type="hidden" name="id" value={promo.id} />
                        <Button type="submit" size="sm" variant="danger">
                          Deactivate
                        </Button>
                      </form>
                    ) : (
                      <span className="text-xs text-ink-60">—</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form action={createPromoAction} className="space-y-3 border border-ink-20 bg-bone-50 p-5">
            <div className="eyebrow mb-4">Create promo</div>
            <div>
              <Label htmlFor="promo-code">Code</Label>
              <Input
                id="promo-code"
                name="code"
                placeholder="WOOF10"
                className="uppercase"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="promo-kind">Kind</Label>
                <select
                  id="promo-kind"
                  name="kind"
                  defaultValue="percent"
                  className="h-11 w-full border border-ink-20 bg-transparent px-3 text-sm"
                >
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed cents</option>
                </select>
              </div>
              <div>
                <Label htmlFor="promo-value">Value (% or cents)</Label>
                <Input id="promo-value" type="number" name="valueInt" min="1" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="promo-minimum">Minimum subtotal (cents)</Label>
                <Input
                  id="promo-minimum"
                  type="number"
                  name="minSubtotalCents"
                  min="0"
                  defaultValue="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="promo-maximum">Max redemptions</Label>
                <Input
                  id="promo-maximum"
                  type="number"
                  name="maxRedemptions"
                  min="1"
                  placeholder="Unlimited"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="promo-starts">Starts</Label>
                <Input
                  id="promo-starts"
                  type="datetime-local"
                  name="startsAt"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="promo-ends">Ends (optional)</Label>
                <Input id="promo-ends" type="datetime-local" name="endsAt" />
              </div>
            </div>
            <Button type="submit" size="sm">
              Create promo
            </Button>
          </form>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl mb-6">Products</h2>
        <div className="space-y-6">
          {prods.map((p) => {
            const vs = variantsByProduct.get(p.id) ?? [];
            return (
              <details key={p.id} className="border border-ink-20 bg-bone-50 p-5">
                <summary className="flex cursor-pointer items-center justify-between">
                  <div>
                    <div className="font-display text-xl">{p.name}</div>
                    <div className="text-xs text-ink-60">
                      {categoriesById.get(p.categoryId)?.name} · {vs.length} variants ·{" "}
                      {formatPrice(p.priceCents)}
                    </div>
                  </div>
                  <Link
                    href={`/p/${p.slug}`}
                    className="text-[11px] tracking-[0.2em] uppercase text-ink-60 hover:text-ink"
                  >
                    View PDP →
                  </Link>
                </summary>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <form action={updateProductAction} className="space-y-3">
                    <div className="eyebrow mb-2">Product details</div>
                    <input type="hidden" name="id" value={p.id} />
                    <div>
                      <Label htmlFor={`name-${p.id}`}>Name</Label>
                      <Input id={`name-${p.id}`} name="name" defaultValue={p.name} />
                    </div>
                    <div>
                      <Label htmlFor={`subtitle-${p.id}`}>Subtitle</Label>
                      <Input
                        id={`subtitle-${p.id}`}
                        name="subtitle"
                        defaultValue={p.subtitle ?? ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`price-${p.id}`}>Price (cents)</Label>
                      <Input
                        id={`price-${p.id}`}
                        type="number"
                        name="priceCents"
                        defaultValue={p.priceCents}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`desc-${p.id}`}>Description</Label>
                      <textarea
                        id={`desc-${p.id}`}
                        name="description"
                        defaultValue={p.description}
                        rows={4}
                        className="w-full border border-ink-20 bg-transparent p-3 text-sm"
                      />
                    </div>
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </form>

                  <div className="space-y-2">
                    <div className="eyebrow mb-2">Variants</div>
                    <ul className="divide-y divide-ink-20 border border-ink-20 bg-bone">
                      {vs.map((v) => (
                        <li key={v.id} className="flex items-center gap-3 p-3">
                          <span
                            className="inline-block h-4 w-4 border border-ink-20"
                            style={{ background: v.colorHex }}
                          />
                          <div className="flex-1 text-sm">
                            {v.size.toUpperCase()} / {v.color}
                            <div className="text-[11px] text-ink-65">{v.sku}</div>
                          </div>
                          <form action={updateVariantInventoryAction} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={v.id} />
                            <input
                              type="number"
                              name="inventory"
                              defaultValue={v.inventory}
                              className="w-20 border border-ink-20 bg-transparent px-2 py-1 text-sm text-right"
                            />
                            <button
                              type="submit"
                              className="text-[10px] tracking-[0.2em] uppercase text-ink-60 hover:text-ink"
                            >
                              Save
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </section>
  );
}
