import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export function SiteFooter() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <div {...stylex.props(styles.topGrid)}>
        <div {...stylex.props(styles.brandBlock)}>
          <div {...stylex.props(styles.brand)}>Barkenciaga</div>
          <p {...stylex.props(styles.brandCopy)}>
            High fashion. For dogs. Designed in Milan, engineered for the daily
            walk, and judged by a rotating panel of studio canines.
          </p>
        </div>
        <div>
          <div {...stylex.props(commonStyles.eyebrow, styles.sectionLabel)}>
            Shop
          </div>
          <ul {...stylex.props(styles.linkList)}>
            <li>
              <Link href="/c/couture" {...stylex.props(styles.link)}>
                Couture
              </Link>
            </li>
            <li>
              <Link href="/c/accessories" {...stylex.props(styles.link)}>
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/c/eyewear" {...stylex.props(styles.link)}>
                Eyewear
              </Link>
            </li>
            <li>
              <Link href="/c/footwear" {...stylex.props(styles.link)}>
                Footwear
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div {...stylex.props(commonStyles.eyebrow, styles.sectionLabel)}>
            Studio
          </div>
          <ul {...stylex.props(styles.linkList)}>
            <li>
              <Link href="/showroom" {...stylex.props(styles.link)}>
                Showroom
              </Link>
            </li>
            <li>
              <Link
                href="/collections/autumn-woofer-26"
                {...stylex.props(styles.link)}
              >
                Autumn/Woofer &apos;26
              </Link>
            </li>
            <li>
              <Link href="/account" {...stylex.props(styles.link)}>
                Account
              </Link>
            </li>
            <li>
              <span {...stylex.props(styles.mutedText)}>Careers</span>
            </li>
          </ul>
        </div>
      </div>
      <div {...stylex.props(styles.bottomBorder)}>
        <div {...stylex.props(styles.bottomRow)}>
          <span>(c) {new Date().getFullYear()} Barkenciaga Studio. A Cursor demo surface.</span>
          <span>AW/26 - Milan / New York / Kennel</span>
        </div>
      </div>
    </footer>
  );
}

const styles = stylex.create({
  footer: {
    marginTop: "8rem",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
    backgroundColor: tokens.bone100,
  },
  topGrid: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "grid",
    gap: "2.5rem",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  brandBlock: {
    "@media (min-width: 768px)": {
      gridColumn: "span 2 / span 2",
    },
  },
  brand: {
    fontFamily: tokens.fontDisplay,
    fontSize: "3rem",
    lineHeight: 1,
  },
  brandCopy: {
    marginTop: "1rem",
    maxWidth: "24rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  sectionLabel: {
    marginBottom: "0.75rem",
  },
  linkList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: "0.5rem",
    fontSize: "0.875rem",
  },
  link: {
    ":hover": {
      color: tokens.burgundy,
    },
  },
  mutedText: {
    color: tokens.ink65,
  },
  bottomBorder: {
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.ink20,
  },
  bottomRow: {
    marginInline: "auto",
    maxWidth: "1400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: "1.5rem",
    paddingBlock: "1.5rem",
    fontSize: "0.75rem",
    color: tokens.ink65,
  },
});
