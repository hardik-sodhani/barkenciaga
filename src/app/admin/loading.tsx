export default function AdminLoading() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-auto max-w-[1400px] px-6 py-12"
    >
      <div className="eyebrow mb-2 text-ink-65">Studio · admin</div>
      <div className="h-10 w-32 animate-pulse bg-bone-200" />
      <div className="mt-12 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 w-full animate-pulse bg-bone-200" />
        ))}
      </div>
      <span className="sr-only">Loading admin</span>
    </section>
  );
}
