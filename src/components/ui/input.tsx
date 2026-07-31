import { forwardRef } from "react";
import * as stylex from "@stylexjs/stylex";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

type InputElementProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  sx?: stylex.StyleXStyles;
};

export const Input = forwardRef<
  HTMLInputElement,
  InputElementProps
>(function Input({ sx, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      {...stylex.props(styles.inputBase, sx)}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    sx?: stylex.StyleXStyles;
  }
>(function Textarea({ sx, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      {...stylex.props(styles.textareaBase, sx)}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
    sx?: stylex.StyleXStyles;
  }
>(function Select({ sx, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      {...props}
      {...stylex.props(styles.selectBase, sx)}
    >
      {children}
    </select>
  );
});

export function Label({
  children,
  htmlFor,
  sx,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  sx?: stylex.StyleXStyles;
}) {
  return (
    <label
      htmlFor={htmlFor}
      {...stylex.props(commonStyles.eyebrow, styles.label, sx)}
    >
      {children}
    </label>
  );
}

const styles = stylex.create({
  inputBase: {
    height: "2.75rem",
    width: "100%",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    backgroundColor: "transparent",
    paddingInline: "0.25rem",
    paddingBlock: "0.5rem",
    fontSize: "0.875rem",
    color: tokens.ink,
    outline: "none",
    transitionProperty: "border-color",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease",
    "::placeholder": {
      color: tokens.ink65,
    },
    ":focus": {
      borderBottomColor: tokens.ink,
    },
  },
  textareaBase: {
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: "transparent",
    padding: "0.75rem",
    fontSize: "0.875rem",
    color: tokens.ink,
    outline: "none",
    transitionProperty: "border-color",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease",
    "::placeholder": {
      color: tokens.ink65,
    },
    ":focus": {
      borderColor: tokens.ink,
    },
  },
  selectBase: {
    height: "2.75rem",
    width: "100%",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.ink20,
    backgroundColor: "transparent",
    paddingInline: "0.25rem",
    paddingBlock: "0.5rem",
    fontSize: "0.875rem",
    color: tokens.ink,
    outline: "none",
    transitionProperty: "border-color",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease",
    appearance: "none",
    ":focus": {
      borderBottomColor: tokens.ink,
    },
  },
  label: {
    display: "block",
    marginBottom: "0.25rem",
  },
});
