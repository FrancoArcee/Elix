"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminHeading from "@/components/admin/AdminHeading";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import FilterChip from "@/components/admin/FilterChip";
import AdminProductCard from "@/components/admin/AdminProductCard";
import { useAdminStore } from "@/context/adminStore";

const CATEGORY_FILTERS = ["Todas", "Perfumes Árabes", "Body Splash"] as const;

const MAX_FEATURED = 6;

export default function AdminProductsPage() {
  const products = useAdminStore((state) => state.products);
  const featured = useAdminStore((state) => state.featured);
  const fetchProducts = useAdminStore((state) => state.fetchProducts);
  const fetchFeatured = useAdminStore((state) => state.fetchFeatured);
  const addFeatured = useAdminStore((state) => state.addFeatured);
  const removeFeatured = useAdminStore((state) => state.removeFeatured);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_FILTERS)[number]>(
    "Todas",
  );

  useEffect(() => {
    fetchProducts();
    fetchFeatured();
  }, [fetchProducts, fetchFeatured]);

  const featuredIds = useMemo(
    () => new Set(featured.map((f) => f.productId)),
    [featured],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "Todas" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  function handleToggleFeatured(productId: string) {
    if (featuredIds.has(productId)) {
      removeFeatured(productId);
    } else if (featuredIds.size < MAX_FEATURED) {
      addFeatured(productId);
    }
  }

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
        </div>

        <p className="pt-6 text-[10px] leading-[15px] text-muted">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto" : "productos"}
          {featuredIds.size > 0 && (
            <> · {featuredIds.size} destacado{featuredIds.size !== 1 && "s"}</>
          )}
        </p>

        <div className="mx-auto grid w-full max-w-[960px] grid-cols-1 gap-4 pt-4 pb-14 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              image={product.image ?? "/images/product-oud-royale.png"}
              brand={product.brand}
              name={product.name}
              badge={product.badge}
              href={`/admin/products/${product.id}`}
              isFeatured={featuredIds.has(product.id)}
              onToggleFeatured={() => handleToggleFeatured(product.id)}
              featuredDisabled={featuredIds.size >= MAX_FEATURED}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
