import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    role: text("role", { enum: ["customer", "admin"] }).notNull().default("customer"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const dogs = pgTable(
  "dogs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    breed: text("breed").notNull(),
    gender: text("gender", { enum: ["male", "female"] }).notNull(),
    sizeBucket: text("size_bucket", { enum: ["xs", "s", "m", "l", "xl"] }).notNull(),
    neckCm: integer("neck_cm"),
    chestCm: integer("chest_cm"),
    backCm: integer("back_cm"),
    weightKg: integer("weight_kg"),
    photoUrl: text("photo_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("dogs_user_idx").on(t.userId)],
);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  heroCopy: text("hero_copy"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const collections = pgTable("collections", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  season: text("season"),
  featured: boolean("featured").notNull().default(false),
});

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    subtitle: text("subtitle"),
    description: text("description").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    brandLine: text("brand_line").notNull().default("Barkenciaga"),
    priceCents: integer("price_cents").notNull(),
    basePalette: jsonb("base_palette").$type<{ a: string; b: string }>().notNull(),
    imagePath: text("image_path"),
    editorialCopy: text("editorial_copy"),
    careCopy: text("care_copy"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.categoryId)],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: text("size", { enum: ["xs", "s", "m", "l", "xl"] }).notNull(),
    color: text("color").notNull(),
    colorHex: text("color_hex").notNull(),
    sku: text("sku").notNull().unique(),
    inventory: integer("inventory").notNull().default(0),
  },
  (t) => [
    index("variants_product_idx").on(t.productId),
    uniqueIndex("variants_product_size_color_idx").on(t.productId, t.size, t.color),
  ],
);

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.productId] })],
);

export const carts = pgTable(
  "carts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    dogId: text("dog_id").references(() => dogs.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("carts_user_idx").on(t.userId)],
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    cartId: text("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => productVariants.id),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("cart_items_cart_idx").on(t.cartId),
    uniqueIndex("cart_items_cart_variant_idx").on(t.cartId, t.variantId),
  ],
);

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("wishlist_user_idx").on(t.userId),
    uniqueIndex("wishlist_user_product_idx").on(t.userId, t.productId),
  ],
);

export const addresses = pgTable(
  "addresses",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: text("label"),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: text("city").notNull(),
    region: text("region").notNull(),
    postalCode: text("postal_code").notNull(),
    country: text("country").notNull().default("US"),
    isDefault: boolean("is_default").notNull().default(false),
  },
  (t) => [index("addresses_user_idx").on(t.userId)],
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    status: text("status", {
      enum: ["pending", "paid", "fulfilled", "cancelled"],
    })
      .notNull()
      .default("pending"),
    email: text("email").notNull(),
    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").notNull().default(0),
    taxCents: integer("tax_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    shippingAddress: jsonb("shipping_address").$type<{
      line1: string;
      line2?: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    }>(),
    dogName: text("dog_name"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_user_idx").on(t.userId)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => productVariants.id),
    productName: text("product_name").notNull(),
    productSlug: text("product_slug").notNull(),
    variantLabel: text("variant_label").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const usersRelations = relations(users, ({ many }) => ({
  dogs: many(dogs),
  orders: many(orders),
  addresses: many(addresses),
  wishlistItems: many(wishlistItems),
}));

export const dogsRelations = relations(dogs, ({ one }) => ({
  user: one(users, { fields: [dogs.userId], references: [users.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  collectionProducts: many(collectionProducts),
  wishlistItems: many(wishlistItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionProducts: many(collectionProducts),
}));

export const collectionProductsRelations = relations(collectionProducts, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionProducts.collectionId],
    references: [collections.id],
  }),
  product: one(products, {
    fields: [collectionProducts.productId],
    references: [products.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  dog: one(dogs, { fields: [carts.dogId], references: [dogs.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
  product: one(products, { fields: [wishlistItems.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Dog = typeof dogs.$inferSelect;
export type DogInsert = typeof dogs.$inferInsert;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Address = typeof addresses.$inferSelect;
