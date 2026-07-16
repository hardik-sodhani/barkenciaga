/**
 * PGlite abort detection shared by bootstrap self-heal and tests.
 */
export function isPgliteAbort(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message ?? err ?? "");
  const causeMsg = String(
    (err as { cause?: { message?: string } })?.cause?.message ?? "",
  );
  return /Aborted\(\)/i.test(msg) || /Aborted\(\)/i.test(causeMsg);
}
