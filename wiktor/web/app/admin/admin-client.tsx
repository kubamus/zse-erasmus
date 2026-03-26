"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";

type Stats = {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
};

type AdminOrder = {
  order_id: number;
  customer_name: string;
  customer_email: string;
  order_date: string;
  total_amount: number;
  status: "pending" | "shipped" | "delivered";
  items_count: number;
};

type ProductForm = {
  name: string;
  description: string;
  category_id: number | "";
  price: string;
  stock_quantity: string;
};

type AdminClientProps = {
  initialProducts: Product[];
  categories: Category[];
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  category_id: "",
  price: "",
  stock_quantity: "",
};

export default function AdminClient({ initialProducts, categories }: AdminClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const categoryLookup = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const refreshData = async () => {
    const [productsRes, statsRes, ordersRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/admin/stats"),
      fetch("/api/admin/orders"),
    ]);

    const productsData = (await productsRes.json()) as { products: Product[] };
    const statsData = (await statsRes.json()) as Stats;
    const ordersData = (await ordersRes.json()) as { orders: AdminOrder[] };

    setProducts(productsData.products);
    setStats(statsData);
    setOrders(ordersData.orders);
  };

  const submitProduct = async () => {
    if (!form.name || !form.price || !form.stock_quantity) {
      setMessage("Name, price and stock are required.");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description || null,
      category_id: form.category_id === "" ? null : form.category_id,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
    };

    const isEditing = editingProductId !== null;
    const endpoint = isEditing ? `/api/products/${editingProductId}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      setMessage(errorData.error ?? "Saving product failed.");
      return;
    }

    setForm(emptyForm);
    setEditingProductId(null);
    setMessage(isEditing ? "Product updated." : "Product created.");
    await refreshData();
  };

  const deleteProduct = async (productId: number) => {
    const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Delete failed.");
      return;
    }
    setMessage("Product removed.");
    await refreshData();
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product.product_id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      category_id: product.category_id ?? "",
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-950">Admin dashboard</h1>
        <button
          type="button"
          onClick={refreshData}
          className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900"
        >
          Refresh data
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="space-y-4 rounded-3xl border border-emerald-100 bg-white/85 p-5">
          <h2 className="text-xl font-semibold text-emerald-950">
            {editingProductId ? "Edit product" : "Add product"}
          </h2>
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Product name"
            className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
          />
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Description"
            rows={4}
            className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
          />
          <select
            value={form.category_id}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                category_id: event.target.value ? Number(event.target.value) : "",
              }))
            }
            className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Price"
              type="number"
              step="0.01"
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
            />
            <input
              value={form.stock_quantity}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, stock_quantity: event.target.value }))
              }
              placeholder="Stock"
              type="number"
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitProduct}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
            >
              {editingProductId ? "Update" : "Create"}
            </button>
            {editingProductId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setForm(emptyForm);
                }}
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900"
              >
                Cancel
              </button>
            ) : null}
          </div>

          {message ? <p className="text-sm text-emerald-800">{message}</p> : null}

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-900">
            <p className="font-medium">Live stats</p>
            {stats ? (
              <div className="mt-2 space-y-1">
                <p>Products: {stats.products}</p>
                <p>Orders: {stats.orders}</p>
                <p>Customers: {stats.customers}</p>
                <p>Revenue: ${stats.revenue.toFixed(2)}</p>
              </div>
            ) : (
              <p className="mt-2 text-emerald-700">Click refresh to load stats.</p>
            )}
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-3xl border border-emerald-100 bg-white/85 p-5">
            <h2 className="mb-4 text-xl font-semibold text-emerald-950">Product inventory</h2>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-4"
                >
                  <div>
                    <p className="font-medium text-emerald-950">{product.name}</p>
                    <p className="text-sm text-emerald-800">
                      {categoryLookup.get(product.category_id ?? -1) ?? "No category"} | ${" "}
                      {Number(product.price).toFixed(2)} | Stock: {product.stock_quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="rounded-full border border-emerald-200 px-3 py-1.5 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.product_id)}
                      className="rounded-full border border-emerald-200 px-3 py-1.5 text-sm text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white/85 p-5">
            <h2 className="mb-4 text-xl font-semibold text-emerald-950">Recent orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-emerald-800">Click refresh to load order history.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.order_id}
                    className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm"
                  >
                    <p className="font-medium text-emerald-950">
                      Order #{order.order_id} - {order.customer_name}
                    </p>
                    <p className="text-emerald-800">
                      {order.customer_email} | {order.items_count} items | ${" "}
                      {Number(order.total_amount).toFixed(2)} | {order.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
