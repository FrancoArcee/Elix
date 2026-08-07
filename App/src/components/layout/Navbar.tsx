import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Perfumes", href: "/products" },
  { label: "Body Splash", href: "/products?type=body-splash" },
  { label: "Nosotros", href: "/nosotros" },
];

type NavbarProps = {
  active?: string;
  withSearchBar?: boolean;
};

export default function Navbar({
  active = "/",
  withSearchBar = true,
}: NavbarProps) {
  return (
    <header className="w-full border-b border-ink/10 bg-background/95">
      <div className="mx-auto flex h-[60px] w-full max-w-[1280px] items-center gap-4 px-6">
        <Link
          href="/"
          className="font-serif text-[20px] font-bold tracking-[5px] text-ink"
        >
          ELIX
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[10px] font-medium uppercase tracking-[1.8px] transition-colors hover:text-ink ${
                item.href === active ? "text-ink" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            aria-label="Buscar"
            className="flex items-center justify-center"
          >
            <Image
              src="/icons/icon-search.svg"
              alt=""
              width={17}
              height={17}
              className="size-[17px]"
            />
          </button>
          <button
            type="button"
            aria-label="Mi cuenta"
            className="flex items-center justify-center"
          >
            <Image
              src="/icons/icon-user.svg"
              alt=""
              width={17}
              height={17}
              className="size-[17px]"
            />
          </button>
        </div>
      </div>

      {withSearchBar && (
        <div className="border-t border-ink/10 px-6 py-4">
          <div className="relative mx-auto w-full max-w-[576px]">
            <Image
              src="/icons/icon-search-input.svg"
              alt=""
              width={14}
              height={14}
              className="absolute left-0 top-1/2 size-[14px] -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Buscar fragancias, marcas…"
              className="w-full border-b border-ink/10 bg-transparent pb-2 pl-5 text-[14px] text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>
      )}
    </header>
  );
}
