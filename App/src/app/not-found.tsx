import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <p className="font-serif text-[60px] font-bold leading-none text-ink/10">404</p>
      <h1 className="pt-4 font-serif text-[20px] font-bold leading-6 text-ink">
        Página no encontrada
      </h1>
      <p className="pt-2 text-[13px] leading-[18px] text-muted">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block border border-ink/10 bg-background px-6 py-3 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
