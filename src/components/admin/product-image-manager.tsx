"use client";

import Image from "next/image";
import { GripVertical, Trash2, Upload } from "lucide-react";
import { useState, useTransition } from "react";
import type { ProductImage } from "@/db/schema";
import {
  deleteProductImageAction,
  reorderProductImagesAction,
  uploadProductImageAction,
} from "@/server/actions/products";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function ProductImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const [orderedImages, setOrderedImages] = useState(images);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function moveImage(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    const previous = orderedImages;
    const fromIndex = previous.findIndex((image) => image.id === draggedId);
    const toIndex = previous.findIndex((image) => image.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const next = [...previous];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedImages(next);
    setDraggedId(null);
    setError("");
    startTransition(async () => {
      try {
        await reorderProductImagesAction({
          productId,
          imageIds: next.map((image) => image.id),
        });
      } catch {
        setOrderedImages(previous);
        setError("Could not save the new image order.");
      }
    });
  }

  function deleteImage(image: ProductImage) {
    if (!window.confirm(`Delete “${image.alt}”?`)) return;
    const previous = orderedImages;
    setOrderedImages((current) => current.filter((item) => item.id !== image.id));
    setError("");
    startTransition(async () => {
      try {
        await deleteProductImageAction({ productId, imageId: image.id });
      } catch {
        setOrderedImages(previous);
        setError("Could not delete the image.");
      }
    });
  }

  return (
    <div className="space-y-4 border-t border-ink-20 pt-5 md:col-span-2">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="eyebrow">Product images</div>
          <p className="mt-1 text-xs text-ink-65">
            Drag images to reorder. The first image is the catalog default.
          </p>
        </div>
        {pending && <span className="text-xs text-ink-65">Saving…</span>}
      </div>

      {orderedImages.length > 0 ? (
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {orderedImages.map((image, index) => (
            <li
              key={image.id}
              draggable={!pending}
              onDragStart={() => setDraggedId(image.id)}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => moveImage(image.id)}
              className={`border bg-bone p-2 ${
                draggedId === image.id ? "border-ink opacity-50" : "border-ink-20"
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-bone-200">
                <Image
                  src={image.path}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="pointer-events-none object-cover"
                />
              </div>
              <div className="mt-2 flex items-start gap-2">
                <GripVertical aria-hidden="true" className="mt-0.5 shrink-0 text-ink-65" size={16} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">
                    {index === 0 ? "Default · " : ""}
                    {image.alt}
                  </div>
                  <div className="truncate text-[11px] text-ink-65">{image.path}</div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteImage(image)}
                  disabled={pending}
                  className="shrink-0 p-1 text-danger disabled:opacity-40"
                  aria-label={`Delete ${image.alt}`}
                >
                  <Trash2 aria-hidden="true" size={15} />
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="border border-dashed border-ink-20 p-5 text-sm text-ink-65">
          No images yet. Upload one to replace the PDP color treatment.
        </div>
      )}

      <form
        action={uploadProductImageAction}
        className="grid items-end gap-3 border border-ink-20 bg-bone p-4 md:grid-cols-[1fr_1fr_auto]"
      >
        <input type="hidden" name="productId" value={productId} />
        <div>
          <Label htmlFor={`image-${productId}`}>Image</Label>
          <Input
            id={`image-${productId}`}
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
          />
        </div>
        <div>
          <Label htmlFor={`image-alt-${productId}`}>Alternative text</Label>
          <Input id={`image-alt-${productId}`} name="alt" type="text" maxLength={240} required />
        </div>
        <Button type="submit" size="sm" disabled={pending}>
          <Upload aria-hidden="true" size={14} />
          Upload
        </Button>
      </form>
      <p aria-live="polite" className="text-xs text-danger">
        {error}
      </p>
    </div>
  );
}
