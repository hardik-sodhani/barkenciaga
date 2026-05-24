export default function CartLoading() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-12"
    >
      <div className="md:col-span-8">
        <div className="eyebrow mb-2 text-ink-65">Your bag</div>
        <div className="h-12 w-48 animate-pulse bg-bone-200" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-ink-20 pb-6">
              <div className="aspect-[4/5] w-24 animate-pulse bg-bone-200" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 animate-pulse bg-bone-200" />
                <div className="h-3 w-1/3 animate-pulse bg-bone-200" />
                <div className="h-9 w-32 animate-pulse bg-bone-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="md:col-span-4">
        <div className="h-64 w-full animate-pulse bg-bone-200" />
      </aside>
      <span className="sr-only">Loading bag</span>
    </section>
  );
}
