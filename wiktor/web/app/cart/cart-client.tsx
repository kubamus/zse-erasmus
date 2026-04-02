"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart-storage";
import type { Product } from "@/lib/types";

type CartClientProps = {
  products: Product[];
};

type CheckoutState = {
  name: string;
  email: string;
  address: string;
  phone: string;
};

export default function CartClient({ products }: CartClientProps) {
  const [cart, setCartState] = useState<Record<number, number>>(() => getCart());
  const [checkout, setCheckout] = useState<CheckoutState>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  const cartItems = useMemo(() => {
    return products
      .filter((product) => cart[product.product_id])
      .map((product) => ({
        ...product,
        quantity: cart[product.product_id],
      }));
  }, [cart, products]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price) * (item.quantity ?? 0),
        0,
      ),
    [cartItems],
  );

  const setQuantity = (productId: number, quantity: number) => {
    const updated = updateCartQuantity(productId, quantity);
    setCartState(updated);
  };

  const deleteItem = (productId: number) => {
    const updated = removeFromCart(productId);
    setCartState(updated);
  };

  const placeOrder = async () => {
    if (!checkout.name || !checkout.email || cartItems.length === 0) {
      setOrderMessage("Please fill name/email and add items before checkout.");
      return;
    }

    setSubmitting(true);
    setOrderMessage(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: checkout,
          items: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        }),
      });
      const data = (await response.json()) as { error?: string; order_id?: number };
      if (!response.ok) {
        setOrderMessage(data.error ?? "Checkout failed.");
        return;
      }

      clearCart();
      setCartState({});
      setCheckout({ name: "", email: "", address: "", phone: "" });
      setOrderMessage(`Order #${data.order_id} has been placed successfully.`);
    } catch {
      setOrderMessage("Checkout failed due to network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-950">Your cart</h1>
        <Link
          href="/shop"
          className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900"
        >
          Continue shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-emerald-800">
          Your cart is empty.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product_id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white/85 p-4"
              >
                <div>
                  <p className="font-medium text-emerald-950">{item.name}</p>
                  <p className="text-sm text-emerald-800">${Number(item.price).toFixed(2)} each</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.product_id, (item.quantity ?? 0) - 1)}
                    className="rounded-full border border-emerald-200 px-3 py-1"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.product_id, (item.quantity ?? 0) + 1)}
                    className="rounded-full border border-emerald-200 px-3 py-1"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-semibold text-emerald-950">
                    ${(Number(item.price) * (item.quantity ?? 0)).toFixed(2)}
                  </p>
                  <button
                    type="button"
                    onClick={() => deleteItem(item.product_id)}
                    className="text-sm text-emerald-700 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4 rounded-3xl border border-emerald-100 bg-white/85 p-5">
            <h2 className="text-xl font-semibold text-emerald-950">Checkout</h2>
            <input
              value={checkout.name}
              onChange={(event) => setCheckout((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Full name"
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
            />
            <input
              value={checkout.email}
              onChange={(event) => setCheckout((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              type="email"
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
            />
            <input
              value={checkout.address}
              onChange={(event) =>
                setCheckout((prev) => ({ ...prev, address: event.target.value }))
              }
              placeholder="Address"
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
            />
            <input
              value={checkout.phone}
              onChange={(event) => setCheckout((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
            />

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <p className="text-sm text-emerald-800">Subtotal</p>
              <p className="text-2xl font-semibold text-emerald-950">${subtotal.toFixed(2)}</p>
            </div>

            <button
              type="button"
              onClick={placeOrder}
              disabled={submitting}
              className="w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white disabled:bg-emerald-300"
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>

            {orderMessage ? <p className="text-sm text-emerald-800">{orderMessage}</p> : null}
          </aside>
        </div>
      )}
    </section>
  );
}
