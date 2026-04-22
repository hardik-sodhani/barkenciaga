import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "ink",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "ink" | "bone" | "burgundy" | "chartreuse";
}) {
  const toneClass = {
    ink: "bg-ink text-bone",
    bone: "bg-bone-200 text-ink",
    burgundy: "bg-burgundy text-bone",
    chartreuse: "bg-chartreuse text-ink",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-[10px] tracking-[0.18em] uppercase font-medium",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
