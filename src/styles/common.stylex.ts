import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/styles/tokens.stylex";

export const commonStyles = stylex.create({
  displayXl: {
    fontFamily: tokens.fontDisplay,
    fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
    lineHeight: 1.02,
    letterSpacing: "-0.02em",
  },
  displayLg: {
    fontFamily: tokens.fontDisplay,
    fontSize: "clamp(2.25rem, 5vw, 4rem)",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  eyebrow: {
    fontFamily: tokens.fontSans,
    fontSize: "0.78rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: tokens.ink80,
    fontWeight: 500,
  },
  textBodySecondary: {
    color: tokens.ink65,
  },
  hairline: {
    border: 0,
    borderTop: `1px solid ${tokens.ink20}`,
  },
  productTileGradient: {
    backgroundImage:
      "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.55), transparent 40%), linear-gradient(135deg, var(--tile-a, #cec3a8) 0%, var(--tile-b, #8a7f62) 100%)",
  },
  kbd: {
    fontFamily: tokens.fontMono,
    fontSize: "0.7rem",
    padding: "0.12rem 0.38rem",
    border: `1px solid ${tokens.ink20}`,
    borderRadius: "3px",
    background: tokens.bone50,
  },
  linkUnderline: {
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  },
});
