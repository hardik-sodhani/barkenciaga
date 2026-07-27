import Link from "next/link";
import type { BarkenciagaSession } from "@/lib/session";
import type { Dog } from "@/db/schema";
import { signOutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { slug: "couture", name: "Couture" },
  { slug: "accessories", name: "Accessories" },
  { slug: "eyewear", name: "Eyewear" },
  { slug: "footwear", name: "Footwear" },
];

export function SiteHeader({
  session,
  cartCount,
  activeDog,
}: {
  session: BarkenciagaSession;
  cartCount: number;
  activeDog: Dog | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-20 bg-bone/95 backdrop-blur">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1400px] items-center gap-6 px-6">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Barkenciaga
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-1">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/c/${c.slug}`}
              className="text-[13px] tracking-[0.2em] uppercase text-ink-60 hover:text-ink"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/collections/autumn-woofer-26"
            className="text-[13px] tracking-[0.2em] uppercase text-ink-60 hover:text-ink"
          >
            AW26
          </Link>
          <Link
            href="/showroom"
            className="text-[13px] tracking-[0.2em] uppercase text-ink-65 hover:text-ink"
          >
            Showroom
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/search"
            className="text-[11px] tracking-[0.24em] uppercase text-ink-60 hover:text-ink"
          >
            Search
          </Link>
          {activeDog && (
            <Link
              href="/account/dogs"
              className={cn(
                "hidden lg:inline-flex items-center gap-2 border border-ink-20 px-3 py-2 text-[11px] tracking-[0.18em] uppercase text-ink-80 hover:border-ink",
              )}
            >
              <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-chartreuse" />
              Shopping for {activeDog.name}
            </Link>
          )}
          {session.userId ? (
            <>
              <Link
                href="/account/wishlist"
                className="text-[11px] tracking-[0.24em] uppercase text-ink-60 hover:text-ink"
              >
                Saved
              </Link>
              <Link
                href="/account"
                className="text-[11px] tracking-[0.24em] uppercase text-ink-60 hover:text-ink"
              >
                {session.userName ?? "Account"}
              </Link>
              {session.userRole === "admin" && (
                <Link
                  href="/admin"
                  className="text-[11px] tracking-[0.24em] uppercase text-burgundy hover:text-burgundy-600"
                >
                  Admin
                </Link>
              )}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-[11px] tracking-[0.24em] uppercase text-ink-65 hover:text-ink"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-[11px] tracking-[0.24em] uppercase text-ink-60 hover:text-ink"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-[11px] tracking-[0.24em] uppercase text-ink hover:text-burgundy"
          >
            Bag <span className="text-ink-65">({cartCount})</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
