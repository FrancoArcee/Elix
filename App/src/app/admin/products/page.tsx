"use client";

import { useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminHeading from "@/components/admin/AdminHeading";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import FilterChip from "@/components/admin/FilterChip";
import AdminProductCard from "@/components/admin/AdminProductCard";
import { useAdminStore } from "@/context/adminStore";

const CATEGORY_FILTERS = ["Todas", "Perfumes Árabes", "Body Splash"] as const;
const STOCK_FILTERS = ["Todo el stock", "En stock", "Sin stock"] as const;

export default function AdminProductsPage() {
  const products = useAdminStore((state) => state.products);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_FILTERS)[number]>(
    "Todas",
  );
  const [stock, setStock] = useState<(typeof STOCK_FILTERS)[number]>(
    "Todo el stock",
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "Todas" || product.category === category;
      const matchesStock =
        stock === "Todo el stock" ||
        (stock === "En stock" && !product.outOfStock) ||
        (stock === "Sin stock" && product.outOfStock);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, category, stock]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Productos" backHref="/admin" />
      <main className="flex-1 px-6 py-8 md:px-10">
        <AdminHeading
          title="Productos"
          actionLabel="+ Agregar"
          actionHref="/admin/products/new"
        />

        <div className="pt-6">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-4">
          {CATEGORY_FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={category === filter}
              onClick={() => setCategory(filter)}
            />
          ))}
          <span className="mx-1 hidden h-[27px] w-px bg-ink/10 sm:inline-block" />
          {STOCK_FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={stock === filter}
              onClick={() => setStock(filter)}
            />
          ))}
        </div>

        <p className="pt-6 text-[10px] leading-[15px] text-muted">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto" : "productos"}
        </p>

        <div className="mx-auto grid w-full max-w-[960px] grid-cols-1 gap-4 pt-4 pb-14 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              image={product.image}
              brand={product.brand}
              name={product.name}
              badge={product.badge}
              outOfStock={product.outOfStock}
              href={`/admin/products/${product.id}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
