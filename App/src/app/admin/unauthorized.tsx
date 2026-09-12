import Link from "next/link";
import type { Metadata } from "next";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "ELIX — Sin permisos",
};

export default function AdminUnauthorized() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader variant="home" />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="font-serif text-[60px] font-bold leading-none text-ink/10">
            403
          </p>
          <h1 className="pt-4 font-serif text-[20px] font-bold leading-6 text-ink">
            Sin permisos
          </h1>
          <p className="pt-2 text-[13px] leading-[18px] text-muted">
            No tenés acceso a esta sección. Contactá al administrador para solicitarte permisos.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/admin"
              className="border border-ink/10 bg-background px-6 py-3 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              Volver al panel
            </Link>
            <Link
              href="/"
              className="bg-ink px-6 py-3 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-background transition-colors hover:bg-ink/90"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
