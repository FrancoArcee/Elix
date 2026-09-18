"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminHeading from "@/components/admin/AdminHeading";
import { useAdminStore } from "@/context/adminStore";

export default function AdminBrandsPage() {
  const router = useRouter();
  const brands = useAdminStore((state) => state.brands);
  const isUnauthorized = useAdminStore((state) => state.isUnauthorized);
  const fetchBrands = useAdminStore((state) => state.fetchBrands);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/admin/unauthorized");
    }
  }, [isUnauthorized, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    if (success) {
      const messages: Record<string, string> = {
        created: "Marca creada",
        updated: "Marca actualizada",
        deleted: "Marca eliminada",
      };
      if (messages[success]) toast.success(messages[success]);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Marcas" backHref="/admin" />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px]">
          <AdminHeading
            title="Marcas"
            actionLabel="+ Agregar"
            actionHref="/admin/brands/new"
          />
          {brands.length === 0 ? (
            <p className="pt-6 text-[12px] leading-4 text-muted">
              No hay marcas cargadas.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/admin/brands/${brand.id}`}
                  className="flex items-center border border-ink/10 bg-background px-6 py-6 transition-colors hover:border-ink/35 md:px-8"
                >
                  <span className="font-serif text-[16px] font-bold leading-6 text-ink">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
