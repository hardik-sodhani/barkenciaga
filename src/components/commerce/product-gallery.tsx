"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/product-images";

export function ProductGallery({
  images,
  productName,
  palette,
  brandLine,
  categoryName,
}: {
  images: GalleryImage[];
  productName: string;
  palette: { a: string; b: string };
  brandLine: string;
  categoryName?: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;
  const active = images[index] ?? null;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      const normalized = ((next % count) + count) % count;
      setIndex(normalized);
      setFadeKey((k) => k + 1);
    },
    [count],
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goTo, index]);

  useEffect(() => {
    if (lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goTo, index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  if (!active) {
    return (
      <div
        className="product-tile-gradient relative aspect-[4/5] border border-ink-20"
        style={
          {
            ["--tile-a" as string]: palette.a,
            ["--tile-b" as string]: palette.b,
          } as React.CSSProperties
        }
      >
        <div className="absolute inset-0 flex items-end p-10">
          <span className="bg-bone/90 px-3 py-1.5 text-xs font-medium tracking-[0.18em] uppercase text-ink">
            {brandLine}
            {categoryName ? ` — ${categoryName}` : ""}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[4/5] overflow-hidden border border-ink-20 bg-bone-50"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label={`Open ${active.alt || productName} in lightbox`}
          onClick={() => setLightboxOpen(true)}
        />
        <Image
          key={`${active.id}-${fadeKey}`}
          src={active.path}
          alt={active.alt || productName}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          priority={index === 0}
          className="object-cover animate-[gallery-fade_280ms_ease-out]"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 border border-ink-20 bg-bone/90 px-2 py-3 text-xs tracking-widest uppercase"
              onClick={() => goTo(index - 1)}
            >
              Prev
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 border border-ink-20 bg-bone/90 px-2 py-3 text-xs tracking-widest uppercase"
              onClick={() => goTo(index + 1)}
            >
              Next
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div
          className="grid grid-cols-4 gap-3"
          role="listbox"
          aria-label={`${productName} image thumbnails`}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="option"
              aria-selected={i === index}
              aria-label={img.alt || `Image ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden border bg-bone-50 transition-opacity",
                i === index ? "border-ink opacity-100" : "border-ink-20 opacity-70 hover:opacity-100",
              )}
              onClick={() => goTo(i)}
            >
              <Image
                src={img.path}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={index}
          productName={productName}
          onClose={() => setLightboxOpen(false)}
          onNavigate={goTo}
        />
      )}
    </div>
  );
}

function Lightbox({
  images,
  index,
  productName,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number;
  productName: string;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const active = images[index]!;
  const [scale, setScale] = useState(1);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef(1);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    setScale(1);
  }, [index]);

  const distance = (touches: React.TouchList) => {
    const a = touches[0];
    const b = touches[1];
    if (!a || !b) return 0;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} lightbox`}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 border border-bone/40 px-3 py-2 text-[11px] tracking-[0.2em] uppercase text-bone"
        onClick={onClose}
      >
        Close
      </button>
      <div
        className="relative h-[min(85vh,900px)] w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            pinchStartDist.current = distance(e.touches);
            pinchStartScale.current = scale;
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinchStartDist.current) {
            const next = distance(e.touches) / pinchStartDist.current;
            setScale(Math.min(3, Math.max(1, pinchStartScale.current * next)));
          }
        }}
        onTouchEnd={() => {
          pinchStartDist.current = null;
        }}
      >
        <Image
          src={active.path}
          alt={active.alt || productName}
          fill
          sizes="100vw"
          className="object-contain transition-transform duration-150"
          style={{ transform: `scale(${scale})` }}
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
          <button
            type="button"
            className="border border-bone/40 px-3 py-2 text-[11px] tracking-[0.2em] uppercase text-bone"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(index - 1);
            }}
          >
            Prev
          </button>
          <button
            type="button"
            className="border border-bone/40 px-3 py-2 text-[11px] tracking-[0.2em] uppercase text-bone"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(index + 1);
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
