import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import type { BarkenciagaSession } from "@/lib/session";
import type { Dog } from "@/db/schema";
import { signOutAction } from "@/server/actions/auth";
import { tokens } from "@/styles/tokens.stylex";

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
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.container)}>
        <Link href="/" {...stylex.props(styles.brand)}>
          Barkenciaga
        </Link>

        <nav {...stylex.props(styles.nav)}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/c/${c.slug}`}
              {...stylex.props(styles.navLink)}
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/collections/autumn-woofer-26"
            {...stylex.props(styles.navLink)}
          >
            AW26
          </Link>
          <Link
            href="/showroom"
            {...stylex.props(styles.navLinkMuted)}
          >
            Showroom
          </Link>
        </nav>

        <div {...stylex.props(styles.rightGroup)}>
          <Link
            href="/search"
            {...stylex.props(styles.utilityLink)}
          >
            Search
          </Link>
          {activeDog && (
            <Link
              href="/account/dogs"
              {...stylex.props(styles.activeDogLink)}
            >
              <span aria-hidden {...stylex.props(styles.activeDogDot)} />
              Shopping for {activeDog.name}
            </Link>
          )}
          {session.userId ? (
            <>
              <Link
                href="/account"
                {...stylex.props(styles.utilityLink)}
              >
                {session.userName ?? "Account"}
              </Link>
              {session.userRole === "admin" && (
                <Link
                  href="/admin"
                  {...stylex.props(styles.adminLink)}
                >
                  Admin
                </Link>
              )}
              <form action={signOutAction}>
                <button
                  type="submit"
                  {...stylex.props(styles.signOutButton)}
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/sign-in"
              {...stylex.props(styles.utilityLink)}
            >
              Sign in
            </Link>
          )}
          <Link
            href="/cart"
            {...stylex.props(styles.cartLink)}
          >
            Bag <span {...stylex.props(styles.cartCount)}>({cartCount})</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

const styles = stylex.create({
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    backgroundColor: "rgba(245, 241, 232, 0.95)",
    backdropFilter: "blur(8px)",
  },
  container: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "flex",
    height: tokens.headerH,
    alignItems: "center",
    gap: "1.5rem",
    paddingInline: "1.5rem",
  },
  brand: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.5rem",
    letterSpacing: "-0.025em",
  },
  nav: {
    display: "none",
    alignItems: "center",
    gap: "1.5rem",
    flex: 1,
    "@media (min-width: 768px)": {
      display: "flex",
    },
  },
  navLink: {
    fontSize: "13px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink60,
    ":hover": {
      color: tokens.ink,
    },
  },
  navLinkMuted: {
    fontSize: "13px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: tokens.ink65,
    ":hover": {
      color: tokens.ink,
    },
  },
  rightGroup: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  utilityLink: {
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: tokens.ink60,
    ":hover": {
      color: tokens.ink,
    },
  },
  activeDogLink: {
    display: "none",
    alignItems: "center",
    gap: "0.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: tokens.ink80,
    ":hover": {
      borderColor: tokens.ink,
    },
    "@media (min-width: 1024px)": {
      display: "inline-flex",
    },
  },
  activeDogDot: {
    display: "inline-block",
    height: "0.5rem",
    width: "0.5rem",
    borderRadius: "9999px",
    backgroundColor: tokens.chartreuse,
  },
  adminLink: {
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: tokens.burgundy,
    ":hover": {
      color: tokens.burgundy600,
    },
  },
  signOutButton: {
    border: 0,
    backgroundColor: "transparent",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: tokens.ink65,
    ":hover": {
      color: tokens.ink,
    },
  },
  cartLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "11px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: tokens.ink,
    ":hover": {
      color: tokens.burgundy,
    },
  },
  cartCount: {
    color: tokens.ink65,
  },
});
