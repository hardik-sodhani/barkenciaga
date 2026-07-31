"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  deleteProductImageAction,
  reorderProductImagesAction,
  uploadProductImageAction,
} from "@/server/actions/products";
import { reorderImageIds, type GalleryImage } from "@/lib/product-images";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ProductImageManager({
  productId,
  images: initialImages,
}: {
  productId: string;
  images: GalleryImage[];
}) {
  const [images, setImages] = useState(
    [...initialImages].sort((a, b) => a.position - b.position),
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const orderedIds = useMemo(() => images.map((img) => img.id), [images]);

  const persistOrder = (nextImages: GalleryImage[]) => {
    const payload = new FormData();
    payload.set("productId", productId);
    payload.set("orderedIds", JSON.stringify(nextImages.map((img) => img.id)));
    startTransition(async () => {
      try {
        setError(null);
        await reorderProductImagesAction(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reorder");
        setImages([...initialImages].sort((a, b) => a.position - b.position));
      }
    });
  };

  const onDropAt = (toIndex: number) => {
    if (dragIndex == null || dragIndex === toIndex) {
      setDragIndex(null);
      return;
    }
    const nextIds = reorderImageIds(orderedIds, dragIndex, toIndex);
    const byId = new Map(images.map((img) => [img.id, img]));
    const nextImages = nextIds.map((id, position) => ({
      ...byId.get(id)!,
      position,
    }));
    setImages(nextImages);
    setDragIndex(null);
    persistOrder(nextImages);
  };

  return (
    <div className="space-y-3">
      <div className="eyebrow mb-2">Gallery images</div>
      {images.length === 0 ? (
        <div className="border border-dashed border-ink-20 p-4 text-xs text-ink-60">
          No gallery images yet. Upload one to populate the PDP.
        </div>
      ) : (
        <ul className="space-y-2">
          {images.map((img, index) => (
            <li
              key={img.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropAt(index)}
              className={cn(
                "flex items-center gap-3 border border-ink-20 bg-bone p-2",
                dragIndex === index && "opacity-50",
              )}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-ink-20">
                <Image src={img.path} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{img.alt || "Untitled"}</div>
                <div className="truncate text-[11px] text-ink-60">{img.path}</div>
                <div className="text-[10px] tracking-[0.16em] uppercase text-ink-60">
                  Position {index} · drag to reorder
                </div>
              </div>
              <form
                action={(fd) => {
                  startTransition(async () => {
                    try {
                      setError(null);
                      await deleteProductImageAction(fd);
                      setImages((prev) =>
                        prev
                          .filter((row) => row.id !== img.id)
                          .map((row, position) => ({ ...row, position })),
                      );
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Delete failed");
                    }
                  });
                }}
              >
                <input type="hidden" name="id" value={img.id} />
                <Button type="submit" size="sm" variant="danger" disabled={pending}>
                  Delete
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form
        className="space-y-2 border border-ink-20 bg-bone p-3"
        action={(fd) => {
          startTransition(async () => {
            try {
              setError(null);
              await uploadProductImageAction(fd);
              // Full refresh after upload so server-assigned id/path appear.
              window.location.reload();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            }
          });
        }}
      >
        <input type="hidden" name="productId" value={productId} />
        <div>
          <Label htmlFor={`file-${productId}`}>Upload image</Label>
          <Input id={`file-${productId}`} type="file" name="file" accept="image/*" required />
        </div>
        <div>
          <Label htmlFor={`alt-${productId}`}>Alt text</Label>
          <Input id={`alt-${productId}`} name="alt" placeholder="Front view" />
        </div>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Working…" : "Upload"}
        </Button>
      </form>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
