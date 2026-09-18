"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminButton from "@/components/admin/AdminButton";
import TextField from "@/components/admin/TextField";
import { useAdminStore } from "@/context/adminStore";
import { brandSchema } from "@/schemas/brand";

export default function AdminNewBrandPage() {
  const router = useRouter();
  const addBrand = useAdminStore((state) => state.addBrand);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = brandSchema.safeParse({ name });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }
    setError("");
    try {
      await addBrand({ name: name.trim() });
      router.push("/admin/brands?success=created");
    } catch {
      setError("No se pudo crear la marca. Puede que ya exista.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Nueva marca" backHref="/admin/brands" />
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
              Crear marca
            </AdminButton>
          </div>
        </form>
      </main>
    </div>
  );
}
