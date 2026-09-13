import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader variant="home" />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="font-serif text-[60px] font-bold leading-none text-ink/10">
            404
          </p>
          <h1 className="pt-4 font-serif text-[20px] font-bold leading-6 text-ink">
            Página no encontrada
          </h1>
          <p className="pt-2 text-[13px] leading-[18px] text-muted">
            La página que buscás no existe o fue movida.
          </p>
          <Link
            href="/admin"
            className="mt-8 inline-block border border-ink/10 bg-background px-6 py-3 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            Volver al panel
          </Link>
        </div>
      </main>
    </div>
  );
}
