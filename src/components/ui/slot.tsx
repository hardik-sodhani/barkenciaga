import { cloneElement, forwardRef, isValidElement, type ReactElement } from "react";

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...props },
  ref,
) {
  if (!isValidElement(children)) return null;
  const child = children as ReactElement<Record<string, unknown>>;
  const childProps = (child.props ?? {}) as Record<string, unknown>;
  const mergedClassName = [
    (props as { className?: string }).className,
    (childProps as { className?: string }).className,
  ]
    .filter(Boolean)
    .join(" ");
  const mergedStyle = {
    ...((childProps as { style?: React.CSSProperties }).style ?? {}),
    ...((props as { style?: React.CSSProperties }).style ?? {}),
  };
  return cloneElement(child, {
    ...props,
    ...childProps,
    className: mergedClassName,
    style: mergedStyle,
    ref,
  } as Record<string, unknown>);
});
