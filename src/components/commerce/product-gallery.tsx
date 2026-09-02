"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/db/schema";
import {
  clampZoom,
  getAdjacentImageIndex,
  getPinchDistance,
  getSwipeDirection,
} from "@/lib/product-gallery";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const heroButtonRef = useRef<HTMLButtonElement>(null);
  const currentImage = images[currentIndex];

  const navigate = useCallback(
    (direction: -1 | 1) => {
      setCurrentIndex((index) => getAdjacentImageIndex(index, images.length, direction));
      setZoom(1);
    },
    [images.length],
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
    requestAnimationFrame(() => heroButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeLightbox, lightboxOpen, navigate]);

  function handleTouchStart(event: React.TouchEvent) {
    if (event.touches.length === 1) {
      touchStartX.current = event.touches[0].clientX;
      pinchStartDistance.current = null;
      return;
    }
    if (event.touches.length === 2) {
      touchStartX.current = null;
      pinchStartDistance.current = getPinchDistance(event.touches[0], event.touches[1]);
      pinchStartZoom.current = zoom;
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (event.touches.length !== 2 || pinchStartDistance.current === null) return;
    event.preventDefault();
    const distance = getPinchDistance(event.touches[0], event.touches[1]);
    setZoom(clampZoom(pinchStartZoom.current * (distance / pinchStartDistance.current)));
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (event.touches.length > 0) return;
    if (touchStartX.current !== null && event.changedTouches.length > 0) {
      const direction = getSwipeDirection(
        touchStartX.current,
        event.changedTouches[0].clientX,
      );
      if (direction) navigate(direction);
    }
    touchStartX.current = null;
    pinchStartDistance.current = null;
  }

  function handleGalleryKeyDown(event: React.KeyboardEvent) {
    if (lightboxOpen) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }
  }

  if (!currentImage) return null;

  return (
    <div onKeyDown={handleGalleryKeyDown} aria-label={`${productName} image gallery`}>
      <div className="relative">
        <button
          ref={heroButtonRef}
          type="button"
          onClick={() => setLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="group relative block aspect-[4/5] w-full overflow-hidden border border-ink-20 bg-bone-50 text-left"
          aria-label={`Open image ${currentIndex + 1} of ${images.length} in lightbox`}
        >
          <Image
            key={currentImage.id}
            src={currentImage.path}
            alt={currentImage.alt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            priority={currentIndex === 0}
            className="animate-[gallery-fade_180ms_ease-out] object-cover"
          />
          <span className="absolute right-4 bottom-4 flex items-center gap-2 bg-bone/90 px-3 py-2 text-[11px] tracking-[0.18em] uppercase text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 aria-hidden="true" size={14} />
            Enlarge
          </span>
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-bone/90 text-ink shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft aria-hidden="true" size={20} />
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-bone/90 text-ink shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight aria-hidden="true" size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Choose product image">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                setCurrentIndex(index);
                setZoom(1);
              }}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden border bg-bone-50 ${
                index === currentIndex ? "border-ink" : "border-ink-20"
              }`}
              aria-label={`Show image ${index + 1}: ${image.alt}`}
              aria-current={index === currentIndex}
            >
              <Image src={image.path} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image lightbox`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 md:p-10"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center bg-bone text-ink"
            aria-label="Close lightbox"
          >
            <X aria-hidden="true" size={22} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="absolute top-1/2 left-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-bone text-ink"
                aria-label="Previous image"
              >
                <ChevronLeft aria-hidden="true" size={22} />
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                className="absolute top-1/2 right-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-bone text-ink"
                aria-label="Next image"
              >
                <ChevronRight aria-hidden="true" size={22} />
              </button>
            </>
          )}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ touchAction: "none" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              key={currentImage.id}
              src={currentImage.path}
              alt={currentImage.alt}
              fill
              sizes="100vw"
              className="animate-[gallery-fade_180ms_ease-out] object-contain transition-transform duration-100"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/70 px-3 py-1.5 text-xs text-bone">
            {currentIndex + 1} / {images.length}
            {zoom > 1 ? ` · ${zoom.toFixed(1)}×` : ""}
          </div>
        </div>
      )}
    </div>
  );
}
