"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Skeleton from "@/components/ui/Skeleton";
import CategoryForm from "@/components/admin/CategoryForm";
import DeletionConfirmationModal from "@/components/admin/DeletionConfirmationModal";
import { useAdminStore } from "@/context/adminStore";

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params.id;

  const categories = useAdminStore((state) => state.categories);
  const products = useAdminStore((state) => state.products);
  const category = categories.find((item) => item.id === categoryId);
  const updateCategory = useAdminStore((state) => state.updateCategory);
  const removeCategory = useAdminStore((state) => state.removeCategory);
  const fetchCategories = useAdminStore((state) => state.fetchCategories);
  const fetchProducts = useAdminStore((state) => state.fetchProducts);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts()]).then(() => setReady(true));
  }, [fetchCategories, fetchProducts]);

  useEffect(() => {
    if (ready && !category) {
      notFound();
    }
  }, [ready, category]);

  if (!ready || !category) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AdminHeader title="Categorías" backHref="/admin/categories" />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <div className="mx-auto w-full max-w-[672px]">
            <div className="border border-ink/10 bg-background p-5 space-y-4">
              <div>
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-12" />
                <Skeleton className="h-9 w-24" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="aspect-[16/9] w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleDelete = async () => {
    await removeCategory(categoryId);
    router.push("/admin/categories?success=deleted");
  };

  const categoryProducts = products.filter((p) => p.categoryId === categoryId);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Editar categoría" backHref="/admin/categories" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <CategoryForm
          mode="edit"
          initialValues={{
            name: category.name,
            description: category.description ?? "",
            color: category.color,
            urlImage: category.image,
          }}
          onSubmit={async (values) => {
            await updateCategory(categoryId, {
              name: values.name,
              description: values.description,
              color: values.color,
              image: values.urlImage || category.image,
            });
            router.push("/admin/categories?success=updated");
          }}
          onCancel={() => router.push("/admin/categories")}
        />
      </main>

      <div className="flex justify-center pb-10">
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:text-ink"
        >
          Eliminar categoría
        </button>
      </div>

      {isConfirmOpen && (
        <DeletionConfirmationModal
          title="Eliminar categoría"
          entityName={category.name}
          message={`Esta acción eliminará permanentemente "${category.name}" y todos sus productos asociados. Esta acción no se puede deshacer.`}
          products={categoryProducts.map((p) => ({ name: p.name, brand: p.brand }))}
          onConfirm={() => {
            setIsConfirmOpen(false);
            handleDelete();
          }}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}