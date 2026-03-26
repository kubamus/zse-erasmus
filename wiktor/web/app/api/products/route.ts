import pool from "@/lib/db";
import { getProducts } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryIdValue = searchParams.get("categoryId");
  const categoryId = categoryIdValue ? Number(categoryIdValue) : undefined;
  const products = await getProducts(Number.isFinite(categoryId) ? categoryId : undefined);
  return Response.json({ products });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    description?: string;
    category_id?: number | null;
    price?: number;
    stock_quantity?: number;
  };

  if (!body.name || body.price === undefined || body.stock_quantity === undefined) {
    return Response.json(
      { error: "name, price and stock_quantity are required" },
      { status: 400 },
    );
  }

  await pool.query(
    "INSERT INTO products (name, description, category_id, price, stock_quantity) VALUES (?, ?, ?, ?, ?)",
    [
      body.name,
      body.description ?? null,
      body.category_id ?? null,
      body.price,
      body.stock_quantity,
    ],
  );

  return Response.json({ ok: true });
}
