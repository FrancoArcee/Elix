"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminStore } from "@/context/adminStore";
import { getProduct, type ProductDetailData } from "@/services/products";

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const brands = useAdminStore((state) => state.brands);
  const categories = useAdminStore((state) => state.categories);
  const updateProduct = useAdminStore((state) => state.updateProduct);
  const fetchProducts = useAdminStore((state) => state.fetchProducts);
  const fetchBrands = useAdminStore((state) => state.fetchBrands);
  const fetchCategories = useAdminStore((state) => state.fetchCategories);

  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    getProduct(productId).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [productId, fetchBrands, fetchCategories]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AdminHeader title="Productos" backHref="/admin/products" />
        <main className="flex flex-1 items-center justify-center px-6">
          <p className="text-[12px] text-muted">Cargando...</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AdminHeader title="Productos" backHref="/admin/products" />
        <main className="flex flex-1 items-center justify-center px-6">
          <p className="text-[12px] text-muted">Producto no encontrado.</p>
        </main>
      </div>
    );
  }

  const topNotes = product.olfactoryNotes
    ?.filter((n) => n.type === "salida" || n.type === "unico")
    .map((n) => n.name)
    .join(", ") ?? "";
  const heartNotes = product.olfactoryNotes
    ?.filter((n) => n.type === "corazon")
    .map((n) => n.name)
    .join(", ") ?? "";
  const baseNotes = product.olfactoryNotes
    ?.filter((n) => n.type === "fondo")
    .map((n) => n.name)
    .join(", ") ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Editar producto" backHref="/admin/products" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <ProductForm
          mode="edit"
          brands={brands}
          categories={categories}
          onBrandCreated={(brand) => {
            useAdminStore.setState((state) => ({
              brands: [...state.brands, brand].sort((a, b) => a.name.localeCompare(b.name)),
            }));
          }}
          initialValues={{
            name: product.name,
            brandId: product.brandId,
            categoryId: product.categoryId,
            targetAudience: product.targetAudience,
            olfactoryFamily: product.fraganceFamily ?? "",
            price: product.price?.toString() ?? "",
            originalPrice: "",
            images: product.images?.length
              ? typeof product.images[0] === "string"
                ? product.images as string[]
                : (product.images as { url: string }[]).map((img) => img.url)
              : product.image
                ? [product.image]
                : [],
            sizes: product.presentation ?? "",
            badge: product.badge ?? "",
            topNotes,
            heartNotes,
            baseNotes,
            description: product.description ?? "",
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

            await updateProduct(productId, {
              name: values.name,
              brandId: values.brandId,
              categoryId: values.categoryId,
              targetAudience: values.targetAudience,
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
