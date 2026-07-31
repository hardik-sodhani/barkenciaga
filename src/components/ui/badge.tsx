import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/styles/tokens.stylex";

export function Badge({
  children,
  tone = "ink",
  sx,
}: {
  children: React.ReactNode;
  tone?: "ink" | "bone" | "burgundy" | "chartreuse";
  sx?: stylex.StyleXStyles;
}) {
  const toneStyle =
    tone === "bone"
      ? styles.toneBone
      : tone === "burgundy"
        ? styles.toneBurgundy
        : tone === "chartreuse"
          ? styles.toneChartreuse
          : styles.toneInk;

  return (
    <span {...stylex.props(styles.base, toneStyle, sx)}>
      {children}
    </span>
  );
}

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    fontSize: "10px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  toneInk: {
    backgroundColor: tokens.ink,
    color: tokens.bone,
  },
  toneBone: {
    backgroundColor: tokens.bone200,
    color: tokens.ink,
  },
  toneBurgundy: {
    backgroundColor: tokens.burgundy,
    color: tokens.bone,
  },
  toneChartreuse: {
    backgroundColor: tokens.chartreuse,
    color: tokens.ink,
  },
});
