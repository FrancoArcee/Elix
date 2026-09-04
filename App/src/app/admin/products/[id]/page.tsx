"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminStore } from "@/context/adminStore";

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const product = useAdminStore((state) =>
    state.products.find((item) => item.id === productId),
  );
  const products = useAdminStore((state) => state.products);
  const updateProduct = useAdminStore((state) => state.updateProduct);

  const brands = Array.from(
    new Set(products.map((item) => item.brand)),
  ).map((brand) => ({ name: brand }));

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Editar producto" backHref="/admin/products" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <ProductForm
          mode="edit"
          brands={brands}
          initialValues={{
            name: product.name,
            brand: product.brand,
            category: product.category,
            orientation: product.orientation ?? "Unisex",
            olfactoryFamily: product.olfactoryFamily ?? "",
            price: product.price?.toString() ?? "",
            originalPrice: product.originalPrice?.toString() ?? "",
            images: product.images?.length
              ? product.images
              : product.image
                ? [product.image]
                : [],
            sizes: product.sizes ?? "",
            badge: product.badge ?? "",
            topNotes: product.topNotes ?? "",
            heartNotes: product.heartNotes ?? "",
            baseNotes: product.baseNotes ?? "",
            description: product.description ?? "",
          }}
          onSubmit={(values) => {
            updateProduct(productId, {
              name: values.name,
              brand: values.brand,
              category: values.category,
              orientation: values.orientation,
              olfactoryFamily: values.olfactoryFamily || undefined,
              price: values.price ? Number(values.price) : undefined,
              originalPrice: values.originalPrice
                ? Number(values.originalPrice)
                : undefined,
              image: values.images[0] || product.image,
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
