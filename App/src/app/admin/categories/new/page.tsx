"use client";

import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import CategoryForm from "@/components/admin/CategoryForm";
import { useAdminStore } from "@/context/adminStore";

export default function AdminNewCategoryPage() {
  const router = useRouter();
  const addCategory = useAdminStore((state) => state.addCategory);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Nueva categoría" backHref="/admin/categories" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <CategoryForm
          mode="create"
          onSubmit={(values) => {
            addCategory({
              name: values.name,
              description: values.description,
              color: values.color,
              image: values.imageUrl || "/images/cat-perfumes-arabes.png",
            });
            router.push("/admin/categories");
          }}
          onCancel={() => router.push("/admin/categories")}
        />
      </main>
    </div>
  );
}
