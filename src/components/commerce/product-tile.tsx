import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/db/schema";
import { cn } from "@/lib/utils";

type TileProduct = Pick<
  Product,
  "slug" | "name" | "subtitle" | "priceCents" | "basePalette" | "brandLine" | "imagePath"
>;

export function ProductTile({
  product,
  eyebrow,
  className,
  large = false,
  priority = false,
}: {
  product: TileProduct;
  eyebrow?: string;
  className?: string;
  large?: boolean;
  priority?: boolean;
}) {
  const { a, b } = product.basePalette;
  const hasImage = Boolean(product.imagePath);
  const alt = product.subtitle
    ? `${product.name}, ${product.subtitle}`
    : product.name;
  const fallbackEyebrow = eyebrow ?? product.brandLine;

  return (
    <Link
      href={`/p/${product.slug}`}
      className={cn("group block", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden border border-ink-20 bg-bone-50 transition-transform group-hover:scale-[1.01]",
          large ? "aspect-[3/4]" : "aspect-[4/5]",
          !hasImage && "product-tile-gradient",
        )}
        style={
          !hasImage
            ? ({
                ["--tile-a" as string]: a,
                ["--tile-b" as string]: b,
              } as React.CSSProperties)
            : undefined
        }
      >
        {hasImage ? (
          <Image
            src={product.imagePath!}
            alt={alt}
            fill
            sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-5">
            <span className="bg-bone/90 px-2.5 py-1 text-xs font-medium tracking-[0.18em] uppercase text-ink">
              {fallbackEyebrow}
            </span>
          </div>
        )}
        {hasImage && eyebrow ? (
          <div className="absolute left-3 top-3 z-10">
            <span className="bg-bone/90 px-2.5 py-1 text-xs font-medium tracking-[0.18em] uppercase text-ink">
              {eyebrow}
            </span>
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-ink">{product.name}</div>
          {product.subtitle && (
            <div className="mt-1 text-xs text-ink-65">{product.subtitle}</div>
          )}
        </div>
        <div className="text-sm font-medium tabular-nums text-ink">
          {formatPrice(product.priceCents)}
        </div>
      </div>
    </Link>
  );
}
