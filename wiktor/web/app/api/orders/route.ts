import pool from "@/lib/db";
import type { CartItemDetailed, OrderPayload } from "@/lib/types";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

type ProductPriceRow = RowDataPacket & {
  product_id: number;
  name: string;
  price: string | number;
  stock_quantity: number;
};

function computeLineItems(
  dbProducts: ProductPriceRow[],
  items: { product_id: number; quantity: number }[],
) {
  const dbById = new Map(dbProducts.map((p) => [p.product_id, p]));
  const detailed: CartItemDetailed[] = [];

  for (const item of items) {
    const product = dbById.get(item.product_id);
    if (!product) {
      throw new Error(`Product ${item.product_id} not found`);
    }
    if (item.quantity <= 0) {
      throw new Error(`Invalid quantity for product ${item.product_id}`);
    }
    if (item.quantity > product.stock_quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    const price = Number(product.price);
    detailed.push({
      product_id: product.product_id,
      name: product.name,
      price,
      quantity: item.quantity,
      line_total: Number((price * item.quantity).toFixed(2)),
    });
  }

  return detailed;
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as OrderPayload;

  if (!payload?.customer?.name || !payload?.customer?.email || !payload?.items?.length) {
    return Response.json(
      { error: "customer.name, customer.email and items are required" },
      { status: 400 },
    );
  }

  const ids = payload.items.map((item) => item.product_id);
  const placeholders = ids.map(() => "?").join(",");
  const [products] = await pool.query<ProductPriceRow[]>(
    `SELECT product_id, name, price, stock_quantity FROM products WHERE product_id IN (${placeholders})`,
    ids,
  );

  let detailedItems: CartItemDetailed[];
  try {
    detailedItems = computeLineItems(products, payload.items);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid cart items" },
      { status: 400 },
    );
  }

  const totalAmount = detailedItems.reduce((sum, item) => sum + item.line_total, 0);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [customerResult] = await connection.query<ResultSetHeader>(
      "INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), address = VALUES(address), phone = VALUES(phone)",
      [
        payload.customer.name,
        payload.customer.email,
        payload.customer.address ?? null,
        payload.customer.phone ?? null,
      ],
    );

    let customerId = customerResult.insertId;
    if (!customerId) {
      const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT customer_id FROM customers WHERE email = ? LIMIT 1",
        [payload.customer.email],
      );
      customerId = Number(rows[0]?.customer_id);
    }

    const [orderResult] = await connection.query<ResultSetHeader>(
      "INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES (?, NOW(), ?, 'pending')",
      [customerId, totalAmount],
    );

    const orderId = orderResult.insertId;

    for (const item of detailedItems) {
      await connection.query(
        "INSERT INTO order_item (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price],
      );
      await connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?",
        [item.quantity, item.product_id],
      );
    }

    await connection.commit();

    return Response.json({
      ok: true,
      order_id: orderId,
      total_amount: Number(totalAmount.toFixed(2)),
      items: detailedItems,
    });
  } catch (error) {
    await connection.rollback();
    return Response.json(
      { error: error instanceof Error ? error.message : "Order creation failed" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
}
