import { redirect } from "next/navigation";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { getSession } from "@/lib/session";
import { getDogsForUser } from "@/lib/dogs";
import { deleteDogAction } from "@/server/actions/dogs";
import { setActiveDogAction } from "@/server/actions/auth";
import { Badge } from "@/components/ui/badge";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

const SIZE_LABEL = { xs: "XS", s: "S", m: "M", l: "L", xl: "XL" } as const;

export default async function DogsPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");
  const dogs = await getDogsForUser(session.userId);

  return (
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.pageHeader)}>
        <div>
          <div {...stylex.props(commonStyles.eyebrow, styles.eyebrow)}>Account</div>
          <h1 {...stylex.props(commonStyles.displayLg)}>Dog profiles</h1>
          <p {...stylex.props(styles.copy)}>
            Dog profiles drive size recommendations on every product page. Add
            measurements for a precise fit.
          </p>
        </div>
        <Link
          href="/account/dogs/new"
          {...stylex.props(styles.newProfileLink)}
        >
          + New profile
        </Link>
      </div>

      <ul {...stylex.props(styles.dogGrid)}>
        {dogs.map((d) => (
          <li key={d.id} {...stylex.props(styles.dogCard)}>
            <div {...stylex.props(styles.rowTop)}>
              <div>
                <div {...stylex.props(styles.rowCenterGap2)}>
                  <h2 {...stylex.props(styles.dogName)}>{d.name}</h2>
                  {session.activeDogId === d.id && (
                    <Badge tone="chartreuse">Active</Badge>
                  )}
                </div>
                <div {...stylex.props(styles.meta)}>
                  {d.breed} · {d.gender}
                </div>
              </div>
              <Badge>Size {SIZE_LABEL[d.sizeBucket]}</Badge>
            </div>
            <dl {...stylex.props(styles.measurementsGrid)}>
              {[
                ["Neck", d.neckCm, "cm"],
                ["Chest", d.chestCm, "cm"],
                ["Back", d.backCm, "cm"],
                ["Weight", d.weightKg, "kg"],
              ].map(([label, val, unit]) => (
                <div key={label as string} {...stylex.props(styles.measurementCell)}>
                  <div {...stylex.props(commonStyles.eyebrow, styles.metricLabel)}>
                    {label}
                  </div>
                  <div {...stylex.props(styles.metricValue)}>
                    {val ? (
                      <>
                        {val} <span {...stylex.props(styles.metricUnit)}>{unit}</span>
                      </>
                    ) : (
                      <span {...stylex.props(styles.metricDash)}>—</span>
                    )}
                  </div>
                </div>
              ))}
            </dl>
            <div {...stylex.props(styles.actionsRow)}>
              <form action={setActiveDogAction}>
                <input type="hidden" name="dogId" value={d.id} />
                <button
                  type="submit"
                  {...stylex.props(styles.actionButton)}
                >
                  {session.activeDogId === d.id
                    ? "Currently shopping for"
                    : `Shop for ${d.name}`}
                </button>
              </form>
              <form action={deleteDogAction}>
                <input type="hidden" name="id" value={d.id} />
                <button
                  type="submit"
                  {...stylex.props(styles.deleteButton)}
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      {dogs.length === 0 && (
        <div {...stylex.props(styles.emptyState)}>
          <p {...stylex.props(styles.emptyTitle)}>No profiles yet.</p>
          <p {...stylex.props(styles.emptyCopy)}>
            Create one to unlock size recommendations.
          </p>
          <Link
            href="/account/dogs/new"
            {...stylex.props(styles.emptyCta)}
          >
            + New profile
          </Link>
        </div>
      )}
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
  eyebrow: { marginBottom: "0.5rem" },
  copy: {
    marginTop: "0.75rem",
    maxWidth: "32rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  newProfileLink: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink,
    paddingInline: "1.5rem",
    paddingBlock: "0.75rem",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    ":hover": {
      backgroundColor: tokens.ink,
      color: tokens.bone,
    },
  },
  dogGrid: {
    marginTop: "3rem",
    marginBottom: 0,
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  dogCard: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
  },
  rowTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rowCenterGap2: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  dogName: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.875rem",
  },
  meta: {
    marginTop: "0.25rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  measurementsGrid: {
    marginTop: "1.5rem",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "0.75rem",
    fontSize: "0.875rem",
  },
  measurementCell: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone,
    padding: "0.75rem",
  },
  metricLabel: {
    fontSize: "9px",
  },
  metricValue: {
    marginTop: "0.25rem",
    fontVariantNumeric: "tabular-nums",
  },
  metricUnit: {
    color: tokens.ink65,
    fontSize: "0.75rem",
  },
  metricDash: {
    color: tokens.ink65,
  },
  actionsRow: {
    marginTop: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    border: 0,
    backgroundColor: "transparent",
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    ":hover": {
      color: tokens.burgundy,
    },
  },
  deleteButton: {
    border: 0,
    backgroundColor: "transparent",
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink65,
    ":hover": {
      color: tokens.danger,
    },
  },
  emptyState: {
    marginTop: "3rem",
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: tokens.ink20,
    padding: "3rem",
    textAlign: "center",
  },
  emptyTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.875rem",
  },
  emptyCopy: {
    marginTop: "0.75rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  emptyCta: {
    marginTop: "1.5rem",
    display: "inline-block",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink,
    paddingInline: "1.5rem",
    paddingBlock: "0.75rem",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    ":hover": {
      backgroundColor: tokens.ink,
      color: tokens.bone,
    },
  },
});
