CREATE TABLE "product_images" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"path" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "product_images_product_position_idx" ON "product_images" USING btree ("product_id","position");
--> statement-breakpoint
INSERT INTO "product_images" ("id", "product_id", "path", "alt", "position")
SELECT
  'img_bf_' || "id",
  "id",
  "image_path",
  COALESCE(NULLIF("subtitle", ''), "name"),
  0
FROM "products"
WHERE "image_path" IS NOT NULL;
--> statement-breakpoint
CREATE OR REPLACE VIEW "product_default_images" AS
SELECT
  pi."product_id",
  pi."path",
  pi."alt",
  pi."position"
FROM "product_images" pi
INNER JOIN (
  SELECT "product_id", MIN("position") AS "min_position"
  FROM "product_images"
  GROUP BY "product_id"
) first_img
  ON first_img."product_id" = pi."product_id"
 AND first_img."min_position" = pi."position";
