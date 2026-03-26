import pool from "@/lib/db";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return Response.json({ error: "Invalid product id" }, { status: 400 });
  }

  const body = (await request.json()) as {
    name?: string;
    description?: string | null;
    category_id?: number | null;
    price?: number;
    stock_quantity?: number;
  };

  await pool.query(
    "UPDATE products SET name = ?, description = ?, category_id = ?, price = ?, stock_quantity = ? WHERE product_id = ?",
    [
      body.name ?? "",
      body.description ?? null,
      body.category_id ?? null,
      body.price ?? 0,
      body.stock_quantity ?? 0,
      productId,
    ],
  );

  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return Response.json({ error: "Invalid product id" }, { status: 400 });
  }

  await pool.query("DELETE FROM products WHERE product_id = ?", [productId]);
  return Response.json({ ok: true });
}
