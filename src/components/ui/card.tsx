import * as stylex from "@stylexjs/stylex";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export function Card({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: stylex.StyleXStyles;
}) {
  return <div {...stylex.props(styles.card, sx)}>{children}</div>;
}

export function CardHeader({
  title,
  eyebrow,
  action,
  sx,
}: {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  action?: React.ReactNode;
  sx?: stylex.StyleXStyles;
}) {
  return (
    <div {...stylex.props(styles.headerRow, sx)}>
      <div>
        {eyebrow && (
          <div {...stylex.props(commonStyles.eyebrow, styles.eyebrowSpacing)}>
            {eyebrow}
          </div>
        )}
        <h2 {...stylex.props(styles.title)}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

const styles = stylex.create({
  card: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1.5rem",
  },
  headerRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  eyebrowSpacing: {
    marginBottom: "0.25rem",
  },
  title: {
    fontSize: "1.25rem",
    fontFamily: tokens.fontDisplay,
  },
});
