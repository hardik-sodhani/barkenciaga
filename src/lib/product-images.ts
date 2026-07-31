import type { ProductImage } from "@/db/schema";

export type GalleryImage = Pick<ProductImage, "id" | "path" | "alt" | "position">;

/** Normalize image order after a drag reorder (source index → target index). */
export function reorderImageIds(ids: string[], fromIndex: number, toIndex: number): string[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= ids.length ||
    toIndex >= ids.length
  ) {
    return [...ids];
  }
  const next = [...ids];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function imagesWithPositions(ids: string[]): Array<{ id: string; position: number }> {
  return ids.map((id, position) => ({ id, position }));
}

/** Build PDP gallery list, falling back to legacy imagePath when no rows exist. */
export function resolveGalleryImages(
  images: GalleryImage[],
  fallback: { imagePath: string | null; name: string; subtitle: string | null },
): GalleryImage[] {
  if (images.length > 0) {
    return [...images].sort((a, b) => a.position - b.position);
  }
  if (!fallback.imagePath) return [];
  return [
    {
      id: "legacy-default",
      path: fallback.imagePath,
      alt: fallback.subtitle ? `${fallback.name}, ${fallback.subtitle}` : fallback.name,
      position: 0,
    },
  ];
}
