"use client";

import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart-storage";
import type { Category, Product } from "@/lib/types";

const gradients = [
  "from-emerald-300 via-lime-200 to-teal-100",
  "from-teal-300 via-emerald-200 to-lime-100",
  "from-lime-300 via-green-200 to-emerald-100",
  "from-green-300 via-emerald-200 to-teal-100",
  "from-emerald-300 via-green-200 to-lime-100",
  "from-teal-300 via-green-200 to-emerald-100",
];

type ShopClientProps = {
  categories: Category[];
  products: Product[];
};

export default function ShopClient({ categories, products }: ShopClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");

  const visibleProducts = useMemo(() => {
    if (activeCategoryId === "all") {
      return products;
    }
    return products.filter((product) => product.category_id === activeCategoryId);
  }, [activeCategoryId, products]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-950">Shop collection</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategoryId("all")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeCategoryId === "all"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                : "border border-emerald-200 bg-white/80 text-emerald-900 hover:border-emerald-300"
            }`}
          >
            All
          </button>
          {categories.map((category) => {
            const selected = activeCategoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selected
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                    : "border border-emerald-200 bg-white/80 text-emerald-900 hover:border-emerald-300"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product, index) => (
          <article
            key={product.product_id}
            className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white/85 shadow-sm shadow-emerald-100 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className={`h-36 bg-gradient-to-br ${gradients[index % gradients.length]} transition duration-300 group-hover:scale-[1.02]`}
            />
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-emerald-700">
                    {product.category_name ?? "Uncategorized"}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight text-emerald-950">
                    {product.name}
                  </h2>
                </div>
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                  Stock {product.stock_quantity}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-emerald-900/75">
                {product.description ?? "No description"}
              </p>

              <div className="flex items-center justify-between pt-1">
                <p className="text-lg font-semibold text-emerald-950">${product.price.toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => addToCart(product.product_id, 1)}
                  disabled={product.stock_quantity <= 0}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
