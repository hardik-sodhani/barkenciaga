# BRK-6 implementation plan

1. **Schema + migration** — Add `productImages` to `schema.ts`. Ship `drizzle/0003_product_images.sql` (table, index, FK cascade, backfill, `product_default_images` view). Update drizzle journal.
2. **Seed** — After product insert, write gallery rows (position 0 = primary path; extra angles reuse related product art with distinct alt labels for demo).
3. **Product query** — `getProductBySlug` returns `images: ProductImage[]` ordered by position; fall back to `imagePath` when empty.
4. **PDP gallery** — Replace single `<Image>` with client `ProductGallery` (hero + thumbnail rail, fade, arrows, swipe, lightbox with pinch-zoom + Escape, `priority` on first image).
5. **Admin actions** — `uploadProductImageAction`, `reorderProductImagesAction`, `deleteProductImageAction`; sync `products.image_path` from position 0.
6. **Admin UI** — Per-product image manager with drag reorder, upload, delete.
7. **Tests** — Cover image ordering helper / reorder persistence logic.
8. **Verify** — typecheck, unit tests, smoke; record PDP gallery demo MP4.
