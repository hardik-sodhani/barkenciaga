import "server-only";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { ensureDbReady } from "@/db/bootstrap";
import type { Order } from "@/db/schema";

export const ORDERS_PAGE_SIZE = 10;

export type OrdersPage = {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getOrdersPage(
  userId: string,
  requestedPage = 1,
): Promise<OrdersPage> {
  await ensureDbReady();

  const [{ total }] = await db
    .select({ total: count() })
    .from(orders)
    .where(eq(orders.userId, userId));

  const totalPages = Math.max(1, Math.ceil(total / ORDERS_PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const offset = (page - 1) * ORDERS_PAGE_SIZE;

  const orderRows =
    total === 0
      ? []
      : await db
          .select()
          .from(orders)
          .where(eq(orders.userId, userId))
          .orderBy(desc(orders.createdAt))
          .limit(ORDERS_PAGE_SIZE)
          .offset(offset);

  return {
    orders: orderRows,
    total,
    page,
    pageSize: ORDERS_PAGE_SIZE,
    totalPages,
  };
}
