import Link from "next/link";
import { getAllCategories } from "@/lib/products";

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

export default async function ShowroomPage() {
  const categories = await getAllCategories();

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="eyebrow mb-2">Internal · Presenters only</div>
      <h1 className="display-xl">Showroom.</h1>
      <p className="mt-4 max-w-2xl text-sm text-ink-60">
        Barkenciaga is a demo surface for Cursor enablement sessions. This page
        gives presenters a single index of canned flows and known good demo
        starting points. Pull live work from Jira (or another project tool).
      </p>

      <section className="mt-16">
        <h2 className="font-display text-3xl mb-6">Canned demo flows</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {DEMO_FLOWS.map((f) => (
            <div key={f.id} className="border border-ink-20 bg-bone-50 p-6">
              <div className="eyebrow mb-2">{f.id}</div>
              <h3 className="font-display text-xl">{f.title}</h3>
              <p className="mt-3 text-sm text-ink-80">{f.summary}</p>
              <p className="mt-3 text-xs text-ink-60 italic">{f.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-4">
        <div className="md:col-span-4">
          <h2 className="font-display text-3xl mb-6">Jump-off points</h2>
        </div>
        <Link
          href="/"
          className="border border-ink-20 bg-bone-50 p-5 hover:bg-bone-200"
        >
          <div className="eyebrow mb-2">Home</div>
          <div className="font-display text-xl">/ (editorial)</div>
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/c/${c.slug}`}
            className="border border-ink-20 bg-bone-50 p-5 hover:bg-bone-200"
          >
            <div className="eyebrow mb-2">Category</div>
            <div className="font-display text-xl">/c/{c.slug}</div>
          </Link>
        ))}
        <Link
          href="/collections/autumn-woofer-26"
          className="border border-ink-20 bg-bone-50 p-5 hover:bg-bone-200"
        >
          <div className="eyebrow mb-2">Collection</div>
          <div className="font-display text-xl">/collections/autumn-woofer-26</div>
        </Link>
        <Link
          href="/account/dogs"
          className="border border-ink-20 bg-bone-50 p-5 hover:bg-bone-200"
        >
          <div className="eyebrow mb-2">Account</div>
          <div className="font-display text-xl">/account/dogs</div>
        </Link>
        <Link
          href="/admin"
          className="border border-ink-20 bg-bone-50 p-5 hover:bg-bone-200"
        >
          <div className="eyebrow mb-2">Admin</div>
          <div className="font-display text-xl">/admin</div>
        </Link>
        <Link
          href="/search?q=rain"
          className="border border-ink-20 bg-bone-50 p-5 hover:bg-bone-200"
        >
          <div className="eyebrow mb-2">Search</div>
          <div className="font-display text-xl">/search?q=rain</div>
        </Link>
      </section>
    </section>
  );
}
