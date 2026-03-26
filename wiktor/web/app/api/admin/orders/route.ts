import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

type OrderRow = RowDataPacket & {
  order_id: number;
  customer_name: string;
  customer_email: string;
  order_date: string;
  total_amount: string | number;
  status: "pending" | "shipped" | "delivered";
  items_count: number;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const [rows] = await pool.query<OrderRow[]>(`
    SELECT
      o.order_id,
      c.name AS customer_name,
      c.email AS customer_email,
      o.order_date,
      o.total_amount,
      o.status,
      COALESCE(SUM(oi.quantity), 0) AS items_count
    FROM orders o
    INNER JOIN customers c ON c.customer_id = o.customer_id
    LEFT JOIN order_item oi ON oi.order_id = o.order_id
    GROUP BY o.order_id, c.name, c.email, o.order_date, o.total_amount, o.status
    ORDER BY o.order_date DESC
    LIMIT 50
  `);

  return Response.json({
    orders: rows.map((row) => ({
      ...row,
      total_amount: Number(row.total_amount),
    })),
  });
}
