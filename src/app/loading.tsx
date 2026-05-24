export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-[1400px] px-6 py-20"
    >
      <div className="eyebrow mb-4 text-ink-65">Loading</div>
      <div className="h-12 w-72 max-w-full animate-pulse bg-bone-200" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse bg-bone-200" />
      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/5] animate-pulse bg-bone-200" />
            <div className="h-3 w-3/4 animate-pulse bg-bone-200" />
            <div className="h-3 w-1/3 animate-pulse bg-bone-200" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading page content</span>
    </div>
  );
}
