"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import CategoryForm from "@/components/admin/CategoryForm";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { useAdminStore } from "@/context/adminStore";

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params.id;

  const category = useAdminStore((state) =>
    state.categories.find((item) => item.id === categoryId),
  );
  const updateCategory = useAdminStore((state) => state.updateCategory);
  const removeCategory = useAdminStore((state) => state.removeCategory);
  const fetchCategories = useAdminStore((state) => state.fetchCategories);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AdminHeader title="Categorías" backHref="/admin/categories" />
        <main className="flex flex-1 items-center justify-center px-6">
          <p className="text-[12px] text-muted">Categoría no encontrada.</p>
        </main>
      </div>
    );
  }

  const handleDelete = async () => {
    await removeCategory(categoryId);
    router.push("/admin/categories");
  };

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
            imageUrl: category.image,
          }}
          onSubmit={async (values) => {
            await updateCategory(categoryId, {
              name: values.name,
              description: values.description,
              color: values.color,
              image: values.imageUrl || category.image,
            });
            router.push("/admin/categories");
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
        <ConfirmationModal
          title="Eliminar categoría"
          message={`¿Seguro que querés eliminar "${category.name}"? Esta acción no se puede deshacer.`}
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