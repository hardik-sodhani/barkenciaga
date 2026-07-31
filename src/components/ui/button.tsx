import { forwardRef } from "react";
import * as stylex from "@stylexjs/stylex";
import { Slot } from "@/components/ui/slot";
import { tokens } from "@/styles/tokens.stylex";

type ButtonVariant =
  | "primary"
  | "accent"
  | "highlight"
  | "outline"
  | "ghost"
  | "subtle"
  | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";
type ButtonShape = "square" | "pill" | "soft";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  sx?: stylex.StyleXStyles;
}

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    whiteSpace: "nowrap",
    fontWeight: 500,
    transitionProperty: "background-color, color, border-color",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease",
    ":focus-visible": {
      outline: `2px solid ${tokens.ink60}`,
      outlineOffset: "2px",
    },
    ":disabled": {
      opacity: 0.4,
      pointerEvents: "none",
    },
  },
  primary: {
    backgroundColor: tokens.ink,
    color: tokens.bone,
    ":hover": { backgroundColor: tokens.ink80 },
  },
  accent: {
    backgroundColor: tokens.burgundy,
    color: tokens.bone,
    ":hover": { backgroundColor: tokens.burgundy600 },
  },
  highlight: {
    backgroundColor: tokens.chartreuse,
    color: tokens.ink,
    ":hover": { backgroundColor: tokens.chartreuse600 },
  },
  outline: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink,
    color: tokens.ink,
    ":hover": {
      backgroundColor: tokens.ink,
      color: tokens.bone,
    },
  },
  ghost: {
    color: tokens.ink,
    ":hover": { backgroundColor: tokens.bone200 },
  },
  subtle: {
    backgroundColor: tokens.bone200,
    color: tokens.ink,
    ":hover": { backgroundColor: tokens.bone300 },
  },
  danger: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.danger,
    color: tokens.danger,
    ":hover": {
      backgroundColor: tokens.danger,
      color: tokens.bone,
    },
  },
  sizeSm: {
    height: "2rem",
    paddingInline: "0.75rem",
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  sizeMd: {
    height: "2.75rem",
    paddingInline: "1.25rem",
    fontSize: "0.875rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  sizeLg: {
    height: "3.5rem",
    paddingInline: "2rem",
    fontSize: "0.875rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  sizeIcon: {
    height: "2.5rem",
    width: "2.5rem",
  },
  shapeSquare: { borderRadius: 0 },
  shapePill: { borderRadius: "9999px" },
  shapeSoft: { borderRadius: tokens.radiusMd },
});

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      shape = "square",
      asChild,
      sx,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const variantStyle = styles[variant];
    const sizeStyle =
      size === "sm"
        ? styles.sizeSm
        : size === "lg"
          ? styles.sizeLg
          : size === "icon"
            ? styles.sizeIcon
            : styles.sizeMd;
    const shapeStyle =
      shape === "pill"
        ? styles.shapePill
        : shape === "soft"
          ? styles.shapeSoft
          : styles.shapeSquare;

    return (
      <Comp
        ref={ref}
        {...stylex.props(
          styles.base,
          variantStyle,
          sizeStyle,
          shapeStyle,
          sx,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
