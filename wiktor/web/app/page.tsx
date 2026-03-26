import Link from "next/link";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(80rem_40rem_at_50%_-10%,#dcfce7,transparent),linear-gradient(180deg,#f8fffa_0%,#f4fbf6_45%,#ecf8ef_100%)]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 sm:px-6">
        <section className="rounded-3xl border border-emerald-100 bg-white/75 p-8 shadow-sm shadow-emerald-100">
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-emerald-700">
            Grocery shopping online store
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">
            Green, light and connected to your MySQL store.
          </h1>
          <p className="mt-4 max-w-2xl text-emerald-900/80">
            Browse products in the shop, add items to cart, place orders, and manage
            inventory in admin.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Go to Shop
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-medium text-emerald-900"
            >
              Open Cart
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-medium text-emerald-900"
            >
              Manage Store
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
