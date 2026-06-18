import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/components/ui/slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background,color,border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // Use the literal bone hex here instead of `text-bone`: a runtime
        // CSS variable override in Chrome was poisoning `--bone` to a dark
        // value, which made primary CTAs render dark text on dark fills.
        primary: "bg-ink text-[#f5f1e8] hover:bg-ink-80 hover:text-[#f5f1e8]",
        accent: "bg-burgundy text-[#f5f1e8] hover:bg-burgundy-600 hover:text-[#f5f1e8]",
        highlight: "bg-chartreuse text-ink hover:bg-chartreuse-600",
        outline: "border border-ink text-ink hover:bg-ink hover:text-bone",
        ghost: "text-ink hover:bg-bone-200",
        subtle: "bg-bone-200 text-ink hover:bg-bone-300",
        danger: "border border-danger text-danger hover:bg-danger hover:text-[#f5f1e8]",
      },
      size: {
        sm: "h-8 px-3 text-xs tracking-wider uppercase",
        md: "h-11 px-5 text-sm tracking-wider uppercase",
        lg: "h-14 px-8 text-sm tracking-widest uppercase",
        icon: "h-10 w-10",
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
