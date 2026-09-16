"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCategories } from "@/services/categories";
import { searchProducts, type ProductData } from "@/services/products";

const STATIC_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
];

function categoryHref(id: string): string {
  return `/products?categoryId=${id}`;
}

type NavbarProps = {
  active?: string;
  withSearchBar?: boolean;
  categories?: { label: string; href: string }[];
};

export default function Navbar({
  active = "/",
  withSearchBar = true,
  categories: categoriesProp,
}: NavbarProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{ label: string; href: string }[]>(
    categoriesProp ?? []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (categoriesProp) return;
    getCategories().then((data) =>
      setCategories(data.map((c) => ({ label: c.name, href: categoryHref(c.id) })))
    );
  }, [categoriesProp]);

  useEffect(() => {
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inDesktop = searchRef.current?.contains(target);
      const inMobile = mobileSearchRef.current?.contains(target);
      if (!inDesktop && !inMobile) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const fetchResults = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = await searchProducts(query.trim());
      setSearchResults(results);
      setIsDropdownOpen(true);
    }, 300);
  }, []);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    fetchResults(value);
  }

  function handleResultClick() {
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    router.push(`/products?search=${encodeURIComponent(q)}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    router.push(`/products?search=${encodeURIComponent(q)}`);
  }

  function toggleSearch() {
    setIsSearchOpen((open) => !open);
    setIsMenuOpen(false);
    if (!isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  const navItems = [
    ...STATIC_ITEMS.slice(0, 1),
    ...categories,
    ...STATIC_ITEMS.slice(1),
  ];

  function renderDropdown() {
    if (!isDropdownOpen) return null;
    return (
      <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-ink/10 bg-background shadow-lg">
        {searchResults.length > 0 ? (
          <ul className="py-1">
            {searchResults.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={handleResultClick}
                  className="flex w-full items-center gap-3 px-4 py-2 transition-colors hover:bg-surface"
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={50}
                      className="h-[50px] w-[40px] flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div className="flex h-[50px] w-[40px] flex-shrink-0 items-center justify-center bg-surface">
                      <span className="text-[8px] uppercase text-muted">Sin imagen</span>
                    </div>
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[9px] uppercase tracking-[1.8px] text-muted">
                      {product.brand}
                    </span>
                    <span className="text-[13px] font-semibold text-ink">
                      {product.name}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="flex w-full items-center px-4 py-3 text-[13px] text-muted transition-colors hover:bg-surface"
          >
            Buscar &quot;{searchQuery}&quot; en la tienda
          </button>
        )}
      </div>
    );
  }

  return (
    <header className="relative w-full border-b border-ink/10 bg-background/95">
      <div className="mx-auto flex h-[60px] w-full max-w-[1280px] items-center gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="font-serif text-[20px] font-bold tracking-[5px] text-ink shrink-0"
        >
          ELIX
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
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

        <div ref={searchRef} className="relative hidden items-center md:flex md:ml-8">
          {withSearchBar && isSearchOpen && (
            <div className="flex items-center gap-3">
              <Image
                src="/icons/icon-search-input.svg"
                alt=""
                width={14}
                height={14}
                className="size-[14px] shrink-0"
              />
              <form onSubmit={handleSearchSubmit} className="w-[280px] lg:w-[360px]">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Buscar fragancias, marcas…"
                  className="w-full border-b border-ink/10 bg-transparent pb-2 text-[14px] text-ink outline-none placeholder:text-muted"
                />
              </form>
            </div>
          )}
          {renderDropdown()}
        </div>

        <div className="flex items-center gap-3 ml-auto shrink-0">
          {withSearchBar && (
            <button
              type="button"
              aria-label={isSearchOpen ? "Cerrar búsqueda" : "Buscar"}
              aria-expanded={isSearchOpen}
              onClick={toggleSearch}
              className={`items-center justify-center ${isSearchOpen ? "hidden md:flex" : "flex"}`}
            >
              <Image
                src={isSearchOpen ? "/icons/icon-close.svg" : "/icons/icon-search.svg"}
                alt=""
                width={17}
                height={17}
                className="size-[17px]"
              />
            </button>
          )}
          <button
            type="button"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            onClick={() => {
              setIsMenuOpen((open) => !open);
              setIsSearchOpen(false);
            }}
            className="flex items-center justify-center md:hidden"
          >
            <Image
              src={isMenuOpen ? "/icons/icon-close.svg" : "/icons/icon-menu.svg"}
              alt=""
              width={18}
              height={18}
              className="size-[18px]"
            />
          </button>
        </div>
      </div>

      {withSearchBar && isSearchOpen && (
        <div className="absolute right-0 top-[60px] z-20 w-full border-t border-ink/10 bg-background px-4 py-4 shadow-lg md:hidden">
          <div ref={mobileSearchRef} className="relative mx-auto flex w-full max-w-[360px] items-end gap-3">
            <div className="relative flex-1">
              <Image
                src="/icons/icon-search-input.svg"
                alt=""
                width={14}
                height={14}
                className="absolute left-0 bottom-2 size-[14px]"
              />
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Buscar fragancias, marcas…"
                  className="w-full border-b border-ink/10 bg-transparent pb-2 pl-5 text-[14px] text-ink outline-none placeholder:text-muted"
                />
              </form>
            </div>
            <button
              type="button"
              aria-label="Cerrar búsqueda"
              onClick={toggleSearch}
              className="flex shrink-0 items-center justify-center pb-2"
            >
              <Image
                src="/icons/icon-close.svg"
                alt=""
                width={15}
                height={15}
                className="size-[15px]"
              />
            </button>
            {renderDropdown()}
          </div>
        </div>
      )}

      {isMenuOpen && (
        <nav className="absolute inset-x-0 top-[60px] z-40 border-t border-ink/10 bg-background shadow-lg md:hidden">
          <div className="flex flex-col gap-5 px-6 py-5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-[11px] font-medium uppercase leading-[16.5px] tracking-[2.2px] transition-colors hover:text-ink ${
                  item.href === active ? "text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
