import { redirect } from "next/navigation";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSession } from "@/lib/session";
import { getDogsForUser } from "@/lib/dogs";
import { setActiveDogAction } from "@/server/actions/auth";
import { ensureDbReady } from "@/db/bootstrap";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export default async function AccountPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");
  await ensureDbReady();

  // DEMO-TODO: this selects every order the user has ever placed. Add
  // pagination (?page= / cursor) once a demo account crosses ~20 orders.
  // See TECH_DEBT.md item 8.
  const [dogs, orderRows] = await Promise.all([
    getDogsForUser(session.userId),
    db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.userId))
      .orderBy(desc(orders.createdAt)),
  ]);

  return (
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.pageHeader)}>
        <div>
          <div {...stylex.props(commonStyles.eyebrow, styles.pageEyebrow)}>Account</div>
          <h1 {...stylex.props(commonStyles.displayLg)}>Hello, {session.userName}.</h1>
        </div>
        <div {...stylex.props(styles.headerEmail)}>{session.userEmail}</div>
      </div>

      <div {...stylex.props(styles.mainGrid)}>
        <section {...stylex.props(styles.dogsPanel)}>
          <div {...stylex.props(styles.panelHeader)}>
            <div>
              <div {...stylex.props(commonStyles.eyebrow, styles.mb1)}>Your dogs</div>
              <h2 {...stylex.props(styles.panelTitle)}>Profiles on file</h2>
            </div>
            <Link
              href="/account/dogs/new"
              {...stylex.props(styles.inlineLink)}
            >
              + Add a dog
            </Link>
          </div>

          {dogs.length === 0 ? (
            <div {...stylex.props(styles.emptyState)}>
              No dog profiles yet.{" "}
              <Link href="/account/dogs/new" {...stylex.props(styles.underlineLink)}>
                Add one
              </Link>
              .
            </div>
          ) : (
            <ul {...stylex.props(styles.dogGrid)}>
              {dogs.map((d) => (
                <li
                  key={d.id}
                  {...stylex.props(styles.dogCard)}
                >
                  <div>
                    <div {...stylex.props(styles.rowAlignCenter)}>
                      <span {...stylex.props(styles.dogName)}>{d.name}</span>
                      {session.activeDogId === d.id && (
                        <Badge tone="chartreuse">Active</Badge>
                      )}
                    </div>
                    <div {...stylex.props(styles.meta)}>
                      {d.breed} · {d.gender} · Size {d.sizeBucket.toUpperCase()}
                    </div>
                  </div>
                  <form action={setActiveDogAction}>
                    <input type="hidden" name="dogId" value={d.id} />
                    <button
                      type="submit"
                      {...stylex.props(styles.inlineActionButton)}
                    >
                      {session.activeDogId === d.id ? "Active" : "Shop for"}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <div {...stylex.props(styles.mt4)}>
            <Link
              href="/account/dogs"
              {...stylex.props(styles.inlineActionLinkMuted)}
            >
              Manage all dogs →
            </Link>
          </div>
        </section>

        <aside {...stylex.props(styles.quickLinks)}>
          <div {...stylex.props(commonStyles.eyebrow, styles.mb3)}>Quick links</div>
          <ul {...stylex.props(styles.quickLinksList)}>
            <li>
              <Link href="/account/dogs" {...stylex.props(styles.hoverBurgundy)}>
                Dog profiles
              </Link>
            </li>
            <li>
              <Link href="/cart" {...stylex.props(styles.hoverBurgundy)}>
                Current bag
              </Link>
            </li>
            <li>
              <Link href="/showroom" {...stylex.props(styles.hoverBurgundy)}>
                Showroom (demo hub)
              </Link>
            </li>
          </ul>
        </aside>
      </div>

      <section {...stylex.props(styles.orderSection)}>
        <div {...stylex.props(commonStyles.eyebrow, styles.mb6)}>Order history</div>
        {orderRows.length === 0 ? (
          <div {...stylex.props(styles.emptyState)}>
            No past orders.
          </div>
        ) : (
          <ul {...stylex.props(styles.historyList)}>
            {orderRows.map((o) => (
              <li key={o.id} {...stylex.props(styles.historyRow)}>
                <div>
                  <div {...stylex.props(styles.medium)}>{o.id}</div>
                  <div {...stylex.props(styles.meta)}>
                    {new Date(o.createdAt).toLocaleDateString()} · {o.status}
                    {o.dogName && ` · for ${o.dogName}`}
                  </div>
                </div>
                <div {...stylex.props(styles.rowAlignCenterGap4)}>
                  <div {...stylex.props(styles.tabularNums)}>{formatPrice(o.totalCents)}</div>
                  <Link
                    href={`/orders/${o.id}`}
                    {...stylex.props(styles.inlineActionLinkMuted)}
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

const styles = stylex.create({
  container: {
    marginInline: "auto",
    maxWidth: "1200px",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
  },
  pageHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  pageEyebrow: { marginBottom: "0.5rem" },
  headerEmail: {
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  mainGrid: {
    marginTop: "3rem",
    display: "grid",
    gap: "2rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
  },
  dogsPanel: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
    "@media (min-width: 768px)": {
      gridColumn: "span 2 / span 2",
    },
  },
  panelHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  mb1: { marginBottom: "0.25rem" },
  panelTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.5rem",
  },
  inlineLink: {
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    ":hover": { color: tokens.burgundy },
  },
  emptyState: {
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: tokens.ink20,
    padding: "2rem",
    textAlign: "center",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  underlineLink: {
    textDecoration: "underline",
  },
  dogGrid: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: "0.75rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  dogCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone,
    padding: "1rem",
  },
  rowAlignCenter: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  dogName: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.25rem",
  },
  meta: {
    marginTop: "0.25rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  inlineActionButton: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    border: 0,
    backgroundColor: "transparent",
    ":hover": {
      color: tokens.burgundy,
    },
  },
  mt4: { marginTop: "1rem" },
  inlineActionLinkMuted: {
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: tokens.ink60,
    ":hover": { color: tokens.ink },
  },
  quickLinks: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
    fontSize: "0.875rem",
  },
  mb3: { marginBottom: "0.75rem" },
  quickLinksList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: "0.5rem",
  },
  hoverBurgundy: {
    ":hover": { color: tokens.burgundy },
  },
  orderSection: {
    marginTop: "3rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
  },
  mb6: { marginBottom: "1.5rem" },
  historyList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "grid",
  },
  historyRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBlock: "1rem",
    fontSize: "0.875rem",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    ":last-child": {
      borderBottomWidth: 0,
    },
  },
  medium: { fontWeight: 500 },
  rowAlignCenterGap4: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  tabularNums: {
    fontVariantNumeric: "tabular-nums",
  },
});
