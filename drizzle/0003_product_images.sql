CREATE TABLE "product_images" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"path" text NOT NULL,
	"alt" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX "product_images_product_position_idx" ON "product_images" USING btree ("product_id","position");
--> statement-breakpoint
INSERT INTO "product_images" ("id", "product_id", "path", "alt", "position")
SELECT 'img_' || "id", "id", "image_path", "name", 0
FROM "products"
WHERE "image_path" IS NOT NULL;
--> statement-breakpoint
CREATE VIEW "product_default_images" AS
SELECT DISTINCT ON ("product_id")
	"product_id",
	"path",
	"alt"
FROM "product_images"
ORDER BY "product_id", "position", "id";
