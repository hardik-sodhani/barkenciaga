export default function CategoryLoading() {
  return (
    <>
      <section
        role="status"
        aria-live="polite"
        className="border-b border-ink-20"
      >
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <div className="eyebrow mb-2 text-ink-65">Category</div>
          <div className="h-14 w-72 animate-pulse bg-bone-200" />
        </div>
      </section>
      <section className="mx-auto flex max-w-[1400px] gap-10 px-6 py-10">
        <aside className="hidden w-48 flex-shrink-0 space-y-2 md:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-24 animate-pulse bg-bone-200" />
          ))}
        </aside>
        <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/5] w-full animate-pulse bg-bone-200" />
              <div className="h-3 w-3/4 animate-pulse bg-bone-200" />
              <div className="h-3 w-1/3 animate-pulse bg-bone-200" />
            </div>
          ))}
        </div>
      </section>
      <span className="sr-only">Loading category</span>
    </>
  );
}
