"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminButton from "@/components/admin/AdminButton";
import TextField from "@/components/admin/TextField";
import Skeleton from "@/components/ui/Skeleton";
import DeletionConfirmationModal from "@/components/admin/DeletionConfirmationModal";
import { useAdminStore } from "@/context/adminStore";
import { brandSchema } from "@/schemas/brand";

export default function AdminEditBrandPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const brandId = params.id;

  const brands = useAdminStore((state) => state.brands);
  const products = useAdminStore((state) => state.products);
  const brand = brands.find((item) => item.id === brandId);
  const updateBrand = useAdminStore((state) => state.updateBrand);
  const removeBrand = useAdminStore((state) => state.removeBrand);
  const fetchBrands = useAdminStore((state) => state.fetchBrands);
  const fetchProducts = useAdminStore((state) => state.fetchProducts);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([fetchBrands(), fetchProducts()]).then(() => setReady(true));
  }, [fetchBrands, fetchProducts]);

  useEffect(() => {
    if (ready && !brand) {
      notFound();
    }
  }, [ready, brand]);

  useEffect(() => {
    if (brand) {
      setName(brand.name);
    }
  }, [brand]);

  if (!ready || !brand) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AdminHeader title="Marcas" backHref="/admin/brands" />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <div className="mx-auto w-full max-w-[672px]">
            <div className="border border-ink/10 bg-background p-5 space-y-4">
              <div>
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const brandProducts = products.filter((p) => p.brandId === brandId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = brandSchema.safeParse({ name });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }
    setError("");
    try {
      await updateBrand(brandId, { name: name.trim() });
      router.push("/admin/brands?success=updated");
    } catch {
      setError("No se pudo actualizar la marca. Puede que ya exista.");
    }
  };

  const handleDelete = async () => {
    await removeBrand(brandId);
    router.push("/admin/brands?success=deleted");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Editar marca" backHref="/admin/brands" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-[672px]">
          <div className="border border-ink/10 bg-background p-5 space-y-4">
            <TextField
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-6">
            <AdminButton
              variant="outline"
              onClick={() => router.push("/admin/brands")}
              className="h-[42px] px-5 py-3"
            >
              Cancelar
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              className="h-[42px] px-5 py-3"
            >
              Guardar cambios
            </AdminButton>
          </div>
        </form>
      </main>

      <div className="flex justify-center pb-10">
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:text-ink"
        >
          Eliminar marca
        </button>
      </div>

      {isConfirmOpen && (
        <DeletionConfirmationModal
          title="Eliminar marca"
          entityName={brand.name}
          message={`Esta acción eliminará permanentemente "${brand.name}" y todos sus productos asociados. Esta acción no se puede deshacer.`}
          products={brandProducts.map((p) => ({ name: p.name, brand: p.brand }))}
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
