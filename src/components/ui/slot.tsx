import { cloneElement, forwardRef, isValidElement, type ReactElement } from "react";

type AnyProps = Record<string, unknown>;
type SlotProps = AnyProps & { children?: React.ReactNode };

/**
 * Compose Slot props onto the single child. Mirrors @radix-ui/react-slot:
 * - Slot (parent) props override child props.
 * - Event handlers (on*) are chained: child's handler runs first, then parent's;
 *   if the child calls preventDefault(), the parent's handler is skipped.
 * - `className` is concatenated.
 * - `style` is merged (parent wins on conflicts).
 * - `ref` is forwarded to the underlying DOM node.
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...childProps };

  for (const key in slotProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    const isHandler = /^on[A-Z]/.test(key);

    if (isHandler && typeof slotValue === "function" && typeof childValue === "function") {
      merged[key] = (...args: unknown[]) => {
        (childValue as (...a: unknown[]) => unknown)(...args);
        const firstArg = args[0] as { defaultPrevented?: boolean } | undefined;
        if (!firstArg?.defaultPrevented) {
          (slotValue as (...a: unknown[]) => unknown)(...args);
        }
      };
    } else if (key === "style") {
      merged.style = { ...(childValue as object), ...(slotValue as object) };
    } else if (key === "className") {
      merged.className = [childValue as string, slotValue as string]
        .filter(Boolean)
        .join(" ");
    } else {
      merged[key] = slotValue;
    }
  }

  return merged;
}

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref,
) {
  if (!isValidElement(children)) return null;
  const child = children as ReactElement<AnyProps>;
  const childProps = (child.props ?? {}) as AnyProps;
  const merged = mergeProps(slotProps, childProps);
  return cloneElement(child, { ...merged, ref });
});
