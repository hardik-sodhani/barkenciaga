export default function ProductLoading() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-20 pt-12 md:grid-cols-12"
    >
      <div className="md:col-span-7">
        <div className="aspect-[4/5] w-full animate-pulse bg-bone-200" />
      </div>
      <div className="md:col-span-5 space-y-6">
        <div className="h-4 w-24 animate-pulse bg-bone-200" />
        <div className="h-12 w-3/4 animate-pulse bg-bone-200" />
        <div className="h-6 w-32 animate-pulse bg-bone-200" />
        <div className="h-24 w-full animate-pulse bg-bone-200" />
        <div className="h-14 w-full animate-pulse bg-bone-200" />
      </div>
      <span className="sr-only">Loading product</span>
    </section>
  );
}
