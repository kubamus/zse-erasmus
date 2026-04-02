import pool from "@/lib/db";
import type { Category, Product } from "@/lib/types";
import type { RowDataPacket } from "mysql2";

type ProductRow = RowDataPacket & {
  product_id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  category_name: string | null;
  price: string | number;
  stock_quantity: number;
};

type CategoryRow = RowDataPacket & {
  id: number | null;
  name: string | null;
  description: string | null;
};

const seedCategories = [
  { id: 1, name: "Footwear", description: "Lightweight steps" },
  { id: 2, name: "Hydration", description: "Fresh daily essentials" },
  { id: 3, name: "Apparel", description: "Soft natural fabrics" },
  { id: 4, name: "Home", description: "Calm home details" },
  { id: 5, name: "Accessories", description: "Utility with style" },
  { id: 6, name: "Tech", description: "Clean desk tools" },
];

const seedProducts = [
  {
    name: "Mint Air Runner",
    description: "Breathable knit sneakers built for everyday city movement.",
    category_id: 1,
    price: 89,
    stock_quantity: 23,
  },
  {
    name: "Forest Glass Bottle",
    description: "Double-wall bottle that keeps drinks cold and your desk clean.",
    category_id: 2,
    price: 34,
    stock_quantity: 45,
  },
  {
    name: "Soft Moss Hoodie",
    description: "Ultra-light hoodie with a relaxed fit and brushed interior.",
    category_id: 3,
    price: 72,
    stock_quantity: 18,
  },
  {
    name: "Leafline Desk Lamp",
    description: "Minimal LED lamp with warm dimming and low energy profile.",
    category_id: 4,
    price: 58,
    stock_quantity: 16,
  },
  {
    name: "Sage Travel Tote",
    description: "Structured tote with hidden zip pockets and soft straps.",
    category_id: 5,
    price: 46,
    stock_quantity: 28,
  },
  {
    name: "Bamboo Wireless Pad",
    description: "Fast charging pad wrapped in natural bamboo and cork.",
    category_id: 6,
    price: 39,
    stock_quantity: 31,
  },
];

type CountRow = RowDataPacket & {
  count: number;
};

export async function ensureSeedData() {
  const [categoryCountRows] = await pool.query<CountRow[]>(
    "SELECT COUNT(*) AS count FROM categories",
  );

  if ((categoryCountRows[0]?.count ?? 0) === 0) {
    for (const category of seedCategories) {
      await pool.query(
        "INSERT INTO categories (id, name, description) VALUES (?, ?, ?)",
        [category.id, category.name, category.description],
      );
    }
  }

  const [productCountRows] = await pool.query<CountRow[]>(
    "SELECT COUNT(*) AS count FROM products",
  );

  if ((productCountRows[0]?.count ?? 0) === 0) {
    for (const product of seedProducts) {
      await pool.query(
        "INSERT INTO products (name, description, category_id, price, stock_quantity) VALUES (?, ?, ?, ?, ?)",
        [
          product.name,
          product.description,
          product.category_id,
          product.price,
          product.stock_quantity,
        ],
      );
    }
  }
}

export async function getCategories(): Promise<Category[]> {
  const [rows] = await pool.query<CategoryRow[]>(
    "SELECT id, name, description FROM categories ORDER BY name ASC",
  );

  return rows
    .filter((row) => row.id !== null && row.name !== null)
    .map((row) => ({
      id: row.id as number,
      name: row.name as string,
      description: row.description,
    }));
}

export async function getProducts(categoryId?: number): Promise<Product[]> {
  const query = `
    SELECT
      p.product_id,
      p.name,
      p.description,
      p.category_id,
      c.name AS category_name,
      p.price,
      p.stock_quantity
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${categoryId ? "WHERE p.category_id = ?" : ""}
    ORDER BY p.product_id DESC
  `;

  const [rows] = categoryId
    ? await pool.query<ProductRow[]>(query, [categoryId])
    : await pool.query<ProductRow[]>(query);

  return rows.map((row) => ({
    product_id: row.product_id,
    name: row.name,
    description: row.description,
    category_id: row.category_id,
    category_name: row.category_name,
    price: Number(row.price),
    stock_quantity: row.stock_quantity,
  }));
}
