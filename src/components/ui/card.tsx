import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-ink-20 bg-bone-50 p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  eyebrow,
  action,
}: {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h2 className="text-xl font-display">{title}</h2>
      </div>
      {action}
    </div>
  );
}
