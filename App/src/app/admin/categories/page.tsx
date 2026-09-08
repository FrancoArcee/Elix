"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminHeading from "@/components/admin/AdminHeading";
import AdminCategoryCard from "@/components/admin/AdminCategoryCard";
import { useAdminStore } from "@/context/adminStore";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const categories = useAdminStore((state) => state.categories);
  const isUnauthorized = useAdminStore((state) => state.isUnauthorized);
  const fetchCategories = useAdminStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/login");
    }
  }, [isUnauthorized, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Categorías" backHref="/admin" />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px]">
          <AdminHeading
            title="Categorías"
            actionLabel="+ Agregar"
            actionHref="/admin/categories/new"
          />
          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
            {categories.map((category) => (
              <AdminCategoryCard
                key={category.id}
                name={category.name}
                image={category.image}
                href={`/admin/categories/${category.id}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
