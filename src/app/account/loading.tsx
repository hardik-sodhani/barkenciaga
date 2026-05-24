export default function AccountLoading() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-auto max-w-[1200px] px-6 py-16"
    >
      <div className="eyebrow mb-2 text-ink-65">Account</div>
      <div className="h-12 w-64 animate-pulse bg-bone-200" />
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 h-64 w-full animate-pulse bg-bone-200" />
        <div className="h-64 w-full animate-pulse bg-bone-200" />
      </div>
      <span className="sr-only">Loading account</span>
    </section>
  );
}
