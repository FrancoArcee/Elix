"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import CategoryForm from "@/components/admin/CategoryForm";
import { useAdminStore } from "@/context/adminStore";

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params.id;

  const category = useAdminStore((state) =>
    state.categories.find((item) => item.id === categoryId),
  );
  const updateCategory = useAdminStore((state) => state.updateCategory);

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Editar categoría" backHref="/admin/categories" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <CategoryForm
          mode="edit"
          initialValues={{
            name: category.name,
            description: "",
            color: category.color,
            imageUrl: category.image,
          }}
          onSubmit={(values) => {
            updateCategory(categoryId, {
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
    </div>
  );
}
