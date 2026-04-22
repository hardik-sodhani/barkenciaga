import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "h-11 w-full border-b border-ink-20 bg-transparent px-1 py-2 text-sm text-ink placeholder:text-ink-65 focus:border-ink outline-none transition-colors",
        className,
      )}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        "w-full border border-ink-20 bg-transparent p-3 text-sm text-ink placeholder:text-ink-65 focus:border-ink outline-none transition-colors",
        className,
      )}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      {...props}
      className={cn(
        "h-11 w-full border-b border-ink-20 bg-transparent px-1 py-2 text-sm text-ink focus:border-ink outline-none transition-colors appearance-none",
        className,
      )}
    >
      {children}
    </select>
  );
});

export function Label({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("eyebrow block mb-1", className)}>
      {children}
    </label>
  );
}
