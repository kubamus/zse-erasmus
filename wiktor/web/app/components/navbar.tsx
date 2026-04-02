"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart-storage";

type NavbarProps = { cartCount?: number };

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Cart", href: "/cart" },
  { label: "Admin", href: "/admin" },
];

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [liveCartCount, setLiveCartCount] = useState(cartCount);

  useEffect(() => {
    const update = () => setLiveCartCount(getCartCount());
    update();
    window.addEventListener("storage", update);
    window.addEventListener("cart-updated", update);

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart-updated", update);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100/70 bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-content-center rounded-xl bg-emerald-500 text-sm text-white shadow-sm shadow-emerald-200">
            leaf
          </span>
          <span className="text-lg font-semibold tracking-tight text-emerald-950">
            Grocery shop
          </span>
        </Link>

        <div className="hidden items-center gap-5 text-sm text-emerald-900 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900 shadow-sm"
        >
          Cart
          <span className="grid h-6 min-w-6 place-content-center rounded-full bg-emerald-500 px-1.5 text-xs text-white">
            {liveCartCount}
          </span>
        </Link>
      </nav>
    </header>
  );
}
