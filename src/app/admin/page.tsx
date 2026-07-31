import { redirect } from "next/navigation";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
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
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

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
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.pageHeader)}>
        <div>
          <div {...stylex.props(commonStyles.eyebrow, styles.pageEyebrow)}>
            Studio · admin
          </div>
          <h1 {...stylex.props(commonStyles.displayLg)}>Ops</h1>
        </div>
        <div {...stylex.props(styles.headerMeta)}>
          {prods.length} products · {variants.length} variants · {recentOrders.length} recent orders
        </div>
      </div>

      <section {...stylex.props(styles.sectionSpacingMd)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Recent orders</h2>
        {recentOrders.length === 0 ? (
          <div {...stylex.props(styles.emptyState)}>
            No orders yet. Place one via /checkout.
          </div>
        ) : (
          <ul {...stylex.props(styles.dividedList, styles.borderedList)}>
            {recentOrders.map((o) => (
              <li key={o.id} {...stylex.props(styles.orderRow)}>
                <div>
                  <div {...stylex.props(styles.medium)}>{o.email}</div>
                  <div {...stylex.props(styles.mutedXs)}>
                    {o.id} · {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div {...stylex.props(styles.mutedXs)}>
                  {o.dogName ? `for ${o.dogName}` : "—"}
                </div>
                <div {...stylex.props(commonStyles.eyebrow)}>{o.status}</div>
                <div {...stylex.props(styles.tabularNums)}>{formatPrice(o.totalCents)}</div>
                <Link
                  href={`/orders/${o.id}`}
                  {...stylex.props(styles.inlineActionLink)}
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section {...stylex.props(styles.sectionSpacingLg)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Promo codes</h2>
        <div {...stylex.props(styles.promoLayout)}>
          <div>
            {promos.length === 0 ? (
              <div {...stylex.props(styles.emptyState)}>
                No promo codes yet.
              </div>
            ) : (
              <ul {...stylex.props(styles.dividedList, styles.borderedList)}>
                {promos.map((promo) => (
                  <li
                    key={promo.id}
                    {...stylex.props(styles.promoRow)}
                  >
                    <div>
                      <div {...stylex.props(styles.rowAlignCenterGap)}>
                        <span {...stylex.props(styles.code)}>{promo.code}</span>
                        <span {...stylex.props(commonStyles.eyebrow)}>
                          {promo.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div {...stylex.props(styles.mutedXs, styles.mt1)}>
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
                    <div {...stylex.props(styles.mutedXs)}>
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
                      <span {...stylex.props(styles.mutedXs)}>—</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form action={createPromoAction} {...stylex.props(styles.createPromoForm)}>
            <div {...stylex.props(commonStyles.eyebrow, styles.mb4)}>
              Create promo
            </div>
            <div>
              <Label htmlFor="promo-code">Code</Label>
              <Input
                id="promo-code"
                name="code"
                placeholder="WOOF10"
                sx={styles.uppercase}
                required
              />
            </div>
            <div {...stylex.props(styles.twoColGap3)}>
              <div>
                <Label htmlFor="promo-kind">Kind</Label>
                <select
                  id="promo-kind"
                  name="kind"
                  defaultValue="percent"
                  {...stylex.props(styles.select)}
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
            <div {...stylex.props(styles.twoColGap3)}>
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
            <div {...stylex.props(styles.twoColGap3)}>
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

      <section {...stylex.props(styles.sectionSpacingLg)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Products</h2>
        <div {...stylex.props(styles.productStack)}>
          {prods.map((p) => {
            const vs = variantsByProduct.get(p.id) ?? [];
            return (
              <details key={p.id} {...stylex.props(styles.productDetails)}>
                <summary {...stylex.props(styles.detailsSummary)}>
                  <div>
                    <div {...stylex.props(styles.productName)}>{p.name}</div>
                    <div {...stylex.props(styles.mutedXs)}>
                      {categoriesById.get(p.categoryId)?.name} · {vs.length} variants ·{" "}
                      {formatPrice(p.priceCents)}
                    </div>
                  </div>
                  <Link
                    href={`/p/${p.slug}`}
                    {...stylex.props(styles.inlineActionLink)}
                  >
                    View PDP →
                  </Link>
                </summary>
                <div {...stylex.props(styles.detailsGrid)}>
                  <form action={updateProductAction} {...stylex.props(styles.formStack)}>
                    <div {...stylex.props(commonStyles.eyebrow, styles.mb2)}>
                      Product details
                    </div>
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
                        {...stylex.props(styles.textarea)}
                      />
                    </div>
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </form>

                  <div {...stylex.props(styles.variantStack)}>
                    <div {...stylex.props(commonStyles.eyebrow, styles.mb2)}>Variants</div>
                    <ul {...stylex.props(styles.variantList)}>
                      {vs.map((v) => (
                        <li key={v.id} {...stylex.props(styles.variantRow)}>
                          <span
                            {...stylex.props(styles.variantColorDot)}
                            style={{ background: v.colorHex }}
                          />
                          <div {...stylex.props(styles.flex1TextSm)}>
                            {v.size.toUpperCase()} / {v.color}
                            <div {...stylex.props(styles.sku)}>{v.sku}</div>
                          </div>
                          <form
                            action={updateVariantInventoryAction}
                            {...stylex.props(styles.variantInventoryForm)}
                          >
                            <input type="hidden" name="id" value={v.id} />
                            <input
                              type="number"
                              name="inventory"
                              defaultValue={v.inventory}
                              {...stylex.props(styles.inventoryInput)}
                            />
                            <button
                              type="submit"
                              {...stylex.props(styles.variantSaveButton)}
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

const styles = stylex.create({
  container: {
    marginInline: "auto",
    maxWidth: "1400px",
    paddingInline: "1.5rem",
    paddingBlock: "3rem",
  },
  pageHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  pageEyebrow: { marginBottom: "0.5rem" },
  headerMeta: {
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  sectionSpacingMd: { marginTop: "3rem" },
  sectionSpacingLg: { marginTop: "4rem" },
  sectionTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.875rem",
    marginBottom: "1.5rem",
  },
  emptyState: {
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: tokens.ink20,
    padding: "2rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  dividedList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  borderedList: {
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
  },
  orderRow: {
    display: "grid",
    gridTemplateColumns: "1fr 120px 80px 100px auto",
    gap: "1rem",
    paddingBlock: "0.75rem",
    fontSize: "0.875rem",
    alignItems: "center",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    ":last-child": {
      borderBottomWidth: 0,
    },
  },
  medium: { fontWeight: 500 },
  mutedXs: {
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  tabularNums: {
    fontVariantNumeric: "tabular-nums",
  },
  inlineActionLink: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink60,
    ":hover": {
      color: tokens.ink,
    },
  },
  promoLayout: {
    display: "grid",
    gap: "2rem",
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.7fr)",
    },
  },
  promoRow: {
    display: "grid",
    gap: "0.75rem",
    paddingBlock: "1rem",
    fontSize: "0.875rem",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    ":last-child": { borderBottomWidth: 0 },
    "@media (min-width: 640px)": {
      gridTemplateColumns: "1fr auto auto",
      alignItems: "center",
    },
  },
  rowAlignCenterGap: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  code: {
    fontWeight: 500,
    letterSpacing: "0.05em",
  },
  mt1: { marginTop: "0.25rem" },
  createPromoForm: {
    display: "grid",
    gap: "0.75rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.25rem",
  },
  mb4: { marginBottom: "1rem" },
  uppercase: { textTransform: "uppercase" },
  twoColGap3: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "0.75rem",
  },
  select: {
    height: "2.75rem",
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: "transparent",
    paddingInline: "0.75rem",
    fontSize: "0.875rem",
  },
  productStack: {
    display: "grid",
    gap: "1.5rem",
  },
  productDetails: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.25rem",
  },
  detailsSummary: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productName: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.25rem",
  },
  detailsGrid: {
    marginTop: "1.5rem",
    display: "grid",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  formStack: {
    display: "grid",
    gap: "0.75rem",
  },
  mb2: { marginBottom: "0.5rem" },
  textarea: {
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: "transparent",
    padding: "0.75rem",
    fontSize: "0.875rem",
  },
  variantStack: {
    display: "grid",
    gap: "0.5rem",
  },
  variantList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone,
  },
  variantRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    ":last-child": { borderBottomWidth: 0 },
  },
  variantColorDot: {
    display: "inline-block",
    height: "1rem",
    width: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
  },
  flex1TextSm: {
    flex: 1,
    fontSize: "0.875rem",
  },
  sku: {
    fontSize: "11px",
    color: tokens.ink65,
  },
  variantInventoryForm: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  inventoryInput: {
    width: "5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: "transparent",
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    fontSize: "0.875rem",
    textAlign: "right",
  },
  variantSaveButton: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink60,
    border: 0,
    backgroundColor: "transparent",
    ":hover": { color: tokens.ink },
  },
});
