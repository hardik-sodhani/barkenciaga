import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/components/ui/slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background,color,border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-ink text-bone hover:bg-ink-80",
        accent: "bg-burgundy text-bone hover:bg-burgundy-600",
        highlight: "bg-chartreuse text-ink hover:bg-chartreuse-600",
        outline: "border border-ink text-ink hover:bg-ink hover:text-bone",
        ghost: "text-ink hover:bg-bone-200",
        subtle: "bg-bone-200 text-ink hover:bg-bone-300",
        danger: "border border-danger text-danger hover:bg-danger hover:text-bone",
        link: "text-ink-65 hover:text-ink",
        linkAccent: "text-ink-65 hover:text-burgundy",
        linkDanger: "text-ink-65 hover:text-danger",
        toggle:
          "border border-ink-20 text-ink hover:border-ink-40 data-[state=on]:border-ink",
        // disabled:opacity-100 overrides the base fade so unavailable options stay
        // legible and read as struck-through rather than dimmed.
        toggleSolid:
          "border border-ink-20 text-ink hover:border-ink data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-bone disabled:opacity-100 disabled:text-ink-65 disabled:line-through",
      },
      size: {
        sm: "h-8 px-3 text-xs tracking-wider uppercase",
        md: "h-11 px-5 text-sm tracking-wider uppercase",
        lg: "h-14 px-8 text-sm tracking-widest uppercase",
        icon: "h-10 w-10",
        inline: "h-auto p-0 text-[11px] tracking-[0.2em] uppercase",
        stepper: "h-11 w-11 text-lg",
        option: "h-auto px-3 py-2 text-xs tracking-widest uppercase",
      },
      shape: {
        square: "rounded-none",
        pill: "rounded-full",
        soft: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "square",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, shape }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
