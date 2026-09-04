"use client";

import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminStore } from "@/context/adminStore";

export default function AdminNewProductPage() {
  const router = useRouter();
  const products = useAdminStore((state) => state.products);
  const addProduct = useAdminStore((state) => state.addProduct);

  const brands = Array.from(
    new Set(products.map((product) => product.brand)),
  ).map((brand) => ({ name: brand }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Nuevo producto" backHref="/admin/products" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <ProductForm
          mode="create"
          brands={brands}
          onSubmit={(values) => {
            addProduct({
              name: values.name,
              brand: values.brand,
              category: values.category,
              orientation: values.orientation,
              olfactoryFamily: values.olfactoryFamily || undefined,
              price: values.price ? Number(values.price) : undefined,
              originalPrice: values.originalPrice
                ? Number(values.originalPrice)
                : undefined,
              image:
                values.images[0] || "/images/product-oud-royale.png",
              images: values.images.length ? values.images : undefined,
              badge: values.badge || undefined,
              sizes: values.sizes || undefined,
              topNotes: values.topNotes || undefined,
              heartNotes: values.heartNotes || undefined,
              baseNotes: values.baseNotes || undefined,
              description: values.description || undefined,
            });
            router.push("/admin/products");
          }}
          onCancel={() => router.push("/admin/products")}
        />
      </main>
    </div>
  );
}
