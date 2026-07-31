import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { getAllCategories } from "@/lib/products";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

const DEMO_FLOWS = [
  {
    id: "pdp-to-checkout",
    title: "Shopper journey",
    summary:
      "From the homepage, click Autumn/Woofer '26, open the Monogram Quilted Coat, add to bag, check out with the seeded card.",
    highlight: "Great moment to show responsive layout and server actions.",
  },
  {
    id: "dog-profile",
    title: "Fit finder with Dog Profiles",
    summary:
      "Sign in as hello@barkenciaga.test, activate Atlas (Standard Poodle), then open any PDP - note the personalized L recommendation.",
    highlight:
      "Demonstrates relational data (dogs ↔ users) driving UI logic.",
  },
  {
    id: "plp-filters",
    title: "Filter + sort refactor demo",
    summary:
      "Open /c/footwear, filter by size, sort by price descending. Ask Cursor to add a price-range filter end-to-end.",
    highlight:
      "Ideal for a cross-file (schema + lib + page) refactor demo.",
  },
  {
    id: "admin-mutation",
    title: "Admin mutation round-trip",
    summary:
      "Sign in as studio@barkenciaga.test, open /admin, change a product's price, refresh /c/couture to see it propagate.",
    highlight:
      "Shows the full Drizzle + server-action + revalidatePath loop.",
  },
  {
    id: "add-wishlist",
    title: "Add a Wishlist feature",
    summary:
      "Challenge Cursor to add a 'save for later' feature - schema table, server actions, UI toggle on PDPs, /account/wishlist page.",
    highlight:
      "Multi-file, multi-layer - the headline end-to-end agent demo.",
  },
  {
    id: "figma-to-code",
    title: "Figma → code",
    summary:
      "Open the Barkenciaga Figma file (see /figma/README.md), generate a new editorial hero from the Figma design using `figma-implement-design`.",
    highlight: "Pairs well with the Code Connect skill.",
  },
];

const SAMPLE_TICKETS = [
  {
    id: "BRK-14",
    title: "Add 'Saved for later' to PDP",
    body: "Shoppers need to bookmark pieces before they're ready to buy. Add a wishlist: heart button on PDP, stored server-side, listed under /account/wishlist.",
  },
  {
    id: "BRK-22",
    title: "Breed-specific size charts",
    body: "Luna's owner asked for a French Bulldog-specific chart on the PDP. Surface the dog's measurements alongside variant sizing, and recommend a size range rather than a single pick.",
  },
  {
    id: "BRK-31",
    title: "Low-stock banner on homepage hero products",
    body: "When a hero product has <6 of any variant, show a 'Limited quantities' eyebrow on the product tile.",
  },
];

export default async function ShowroomPage() {
  const categories = await getAllCategories();

  return (
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(commonStyles.eyebrow, styles.topEyebrow)}>
        Internal · Presenters only
      </div>
      <h1 {...stylex.props(commonStyles.displayXl)}>Showroom.</h1>
      <p {...stylex.props(styles.intro)}>
        Barkenciaga is a demo surface for Cursor enablement sessions. This page
        gives presenters a single index of canned flows, sample tickets, and
        known good demo starting points.
      </p>

      <section {...stylex.props(styles.sectionSpacing)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Canned demo flows</h2>
        <div {...stylex.props(styles.flowGrid)}>
          {DEMO_FLOWS.map((f) => (
            <div key={f.id} {...stylex.props(styles.flowCard)}>
              <div {...stylex.props(commonStyles.eyebrow, styles.flowEyebrow)}>
                {f.id}
              </div>
              <h3 {...stylex.props(styles.flowTitle)}>{f.title}</h3>
              <p {...stylex.props(styles.flowSummary)}>{f.summary}</p>
              <p {...stylex.props(styles.flowHighlight)}>{f.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      <section {...stylex.props(styles.sectionSpacing)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Sample tickets</h2>
        <p {...stylex.props(styles.sampleCopy)}>
          Drop these into a Linear/Jira integration, or paste directly into
          Cursor as a task. Each ticket is sized for a 5-15 minute live demo.
        </p>
        <ul {...stylex.props(styles.ticketList)}>
          {SAMPLE_TICKETS.map((t) => (
            <li key={t.id} {...stylex.props(styles.ticketItem)}>
              <div {...stylex.props(styles.ticketId)}>{t.id}</div>
              <div>
                <div {...stylex.props(styles.ticketTitle)}>{t.title}</div>
                <div {...stylex.props(styles.ticketBody)}>{t.body}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section {...stylex.props(styles.jumpGrid)}>
        <div {...stylex.props(styles.jumpHeader)}>
          <h2 {...stylex.props(styles.sectionTitle)}>Jump-off points</h2>
        </div>
        <Link
          href="/"
          {...stylex.props(styles.jumpCard)}
        >
          <div {...stylex.props(commonStyles.eyebrow, styles.jumpEyebrow)}>Home</div>
          <div {...stylex.props(styles.jumpPath)}>/ (editorial)</div>
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/c/${c.slug}`}
            {...stylex.props(styles.jumpCard)}
          >
            <div {...stylex.props(commonStyles.eyebrow, styles.jumpEyebrow)}>
              Category
            </div>
            <div {...stylex.props(styles.jumpPath)}>/c/{c.slug}</div>
          </Link>
        ))}
        <Link
          href="/collections/autumn-woofer-26"
          {...stylex.props(styles.jumpCard)}
        >
          <div {...stylex.props(commonStyles.eyebrow, styles.jumpEyebrow)}>
            Collection
          </div>
          <div {...stylex.props(styles.jumpPath)}>/collections/autumn-woofer-26</div>
        </Link>
        <Link
          href="/account/dogs"
          {...stylex.props(styles.jumpCard)}
        >
          <div {...stylex.props(commonStyles.eyebrow, styles.jumpEyebrow)}>
            Account
          </div>
          <div {...stylex.props(styles.jumpPath)}>/account/dogs</div>
        </Link>
        <Link
          href="/admin"
          {...stylex.props(styles.jumpCard)}
        >
          <div {...stylex.props(commonStyles.eyebrow, styles.jumpEyebrow)}>
            Admin
          </div>
          <div {...stylex.props(styles.jumpPath)}>/admin</div>
        </Link>
        <Link
          href="/search?q=rain"
          {...stylex.props(styles.jumpCard)}
        >
          <div {...stylex.props(commonStyles.eyebrow, styles.jumpEyebrow)}>
            Search
          </div>
          <div {...stylex.props(styles.jumpPath)}>/search?q=rain</div>
        </Link>
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
  topEyebrow: { marginBottom: "0.5rem" },
  intro: {
    marginTop: "1rem",
    maxWidth: "42rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  sectionSpacing: { marginTop: "4rem" },
  sectionTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.875rem",
    marginBottom: "1.5rem",
  },
  flowGrid: {
    display: "grid",
    gap: "1rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  flowCard: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
  },
  flowEyebrow: { marginBottom: "0.5rem" },
  flowTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.25rem",
  },
  flowSummary: {
    marginTop: "0.75rem",
    fontSize: "0.875rem",
    color: tokens.ink80,
  },
  flowHighlight: {
    marginTop: "0.75rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
    fontStyle: "italic",
  },
  sampleCopy: {
    marginBottom: "1.5rem",
    maxWidth: "42rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  ticketList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
  },
  ticketItem: {
    display: "grid",
    gap: "1rem",
    paddingBlock: "1.25rem",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    ":last-child": { borderBottomWidth: 0 },
    "@media (min-width: 768px)": {
      gridTemplateColumns: "120px 1fr",
    },
  },
  ticketId: {
    fontFamily: tokens.fontMono,
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  ticketTitle: {
    fontWeight: 500,
  },
  ticketBody: {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  jumpGrid: {
    marginTop: "4rem",
    display: "grid",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  jumpHeader: {
    "@media (min-width: 768px)": {
      gridColumn: "span 4 / span 4",
    },
  },
  jumpCard: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.25rem",
    ":hover": {
      backgroundColor: tokens.bone200,
    },
  },
  jumpEyebrow: { marginBottom: "0.5rem" },
  jumpPath: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.25rem",
  },
});
