import Navbar from "@/app/components/navbar";
import ShopClient from "@/app/shop/shop-client";
import { ensureSeedData, getCategories, getProducts } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  await ensureSeedData();
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="min-h-screen bg-[radial-gradient(80rem_40rem_at_50%_-10%,#dcfce7,transparent),linear-gradient(180deg,#f8fffa_0%,#f4fbf6_45%,#ecf8ef_100%)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <ShopClient categories={categories} products={products} />
      </main>
    </div>
  );
}
