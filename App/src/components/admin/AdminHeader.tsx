import Image from "next/image";
import Link from "next/link";

type AdminHeaderProps = {
  variant?: "home" | "page";
  title?: string;
  backHref?: string;
};

export default function AdminHeader({
  variant = "page",
  title,
  backHref = "/admin",
}: AdminHeaderProps) {
  return (
    <header className="relative flex w-full items-center justify-between border-b border-ink/10 bg-background px-4 py-4 md:px-6">
      <div className="flex min-w-[96px] items-center">
        {variant === "home" ? (
          <span className="font-serif text-[18px] font-bold leading-7 tracking-[3.6px] text-ink">
            ELIX
          </span>
        ) : (
          <Link
            href={backHref}
            className="group flex items-center gap-1.5 py-1 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:text-ink"
          >
            <Image
              src="/icons/icon-arrow-left.svg"
              alt=""
              width={11}
              height={11}
              className="size-[11px]"
            />
            Volver
          </Link>
        )}
      </div>

      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
        {variant === "home" ? (
          <p className="text-center text-[9px] uppercase leading-[13.5px] tracking-[1.8px] text-muted">
            Panel de administrador
          </p>
        ) : (
          <h1 className="text-center font-serif text-[16px] font-bold leading-6 tracking-[2.4px] text-ink">
            {title}
          </h1>
        )}
      </div>

      <div className="flex min-w-[96px] items-center justify-end">
        <Link
          href="/"
          className="flex items-center gap-1.5 border border-ink/10 px-3 py-1.5 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
        >
          <Image
            src="/icons/icon-exit.svg"
            alt=""
            width={11}
            height={11}
            className="size-[11px]"
          />
          Salir
        </Link>
      </div>
    </header>
  );
}
