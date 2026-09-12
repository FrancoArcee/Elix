"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminStore } from "@/context/adminStore";

export default function AdminNewProductPage() {
  const router = useRouter();
  const brands = useAdminStore((state) => state.brands);
  const categories = useAdminStore((state) => state.categories);
  const addProduct = useAdminStore((state) => state.addProduct);
  const fetchProducts = useAdminStore((state) => state.fetchProducts);
  const fetchBrands = useAdminStore((state) => state.fetchBrands);
  const fetchCategories = useAdminStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Nuevo producto" backHref="/admin/products" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <ProductForm
          mode="create"
          brands={brands}
          categories={categories}
          onBrandCreated={(brand) => {
            useAdminStore.setState((state) => ({
              brands: [...state.brands, brand].sort((a, b) => a.name.localeCompare(b.name)),
            }));
          }}
          onSubmit={async (values) => {
            const isBodySplash = categories
              .find((c) => c.id === values.categoryId)
              ?.name.toLowerCase()
              .includes("body splash") ?? false;

            const notes: { noteName: string; type: string }[] = [];
            const noteNames = (values.topNotes ?? "").split(",").map((s) => s.trim()).filter(Boolean);
            for (const n of noteNames) {
              notes.push({ noteName: n, type: isBodySplash ? "unico" : "salida" });
            }
            if (!isBodySplash) {
              for (const n of (values.heartNotes ?? "").split(",").map((s) => s.trim()).filter(Boolean)) {
                notes.push({ noteName: n, type: "corazon" });
              }
              for (const n of (values.baseNotes ?? "").split(",").map((s) => s.trim()).filter(Boolean)) {
                notes.push({ noteName: n, type: "fondo" });
              }
            }

            await addProduct({
              name: values.name,
              brandId: values.brandId,
              categoryId: values.categoryId,
              targetAudience: values.targetAudience,
              concentration: values.concentration || undefined,
              badge: values.badge || undefined,
              description: values.description || undefined,
              price: values.price ? Number(values.price) : undefined,
              fraganceFamily: values.olfactoryFamily || undefined,
              presentation: values.sizes || undefined,
              images: values.images.map((url) => ({ url })),
              notes: notes.length ? notes : undefined,
            });
            await fetchProducts();
            router.push("/admin/products");
          }}
          onCancel={() => router.push("/admin/products")}
        />
      </main>
    </div>
  );
}
