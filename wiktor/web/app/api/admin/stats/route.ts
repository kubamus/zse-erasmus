import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

type CountRow = RowDataPacket & { count: number };
type RevenueRow = RowDataPacket & { revenue: string | number | null };

export const dynamic = "force-dynamic";

export async function GET() {
  const [[productsCount], [ordersCount], [customersCount], [revenueRow]] = await Promise.all([
    pool.query<CountRow[]>("SELECT COUNT(*) AS count FROM products"),
    pool.query<CountRow[]>("SELECT COUNT(*) AS count FROM orders"),
    pool.query<CountRow[]>("SELECT COUNT(*) AS count FROM customers"),
    pool.query<RevenueRow[]>("SELECT SUM(total_amount) AS revenue FROM orders"),
  ]);

  return Response.json({
    products: productsCount[0]?.count ?? 0,
    orders: ordersCount[0]?.count ?? 0,
    customers: customersCount[0]?.count ?? 0,
    revenue: Number(revenueRow[0]?.revenue ?? 0),
  });
}
