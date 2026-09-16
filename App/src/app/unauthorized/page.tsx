import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso no autorizado",
  robots: { index: false },
};

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-serif text-[28px] font-bold text-ink sm:text-[36px]">
          Acceso no autorizado
        </h1>
        <p className="mt-3 text-[14px] text-muted">
          No tenés permiso para acceder a esta sección.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-lg bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[1.8px] text-background transition-colors hover:bg-ink/80"
        >
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}
