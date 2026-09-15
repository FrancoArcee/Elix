"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useRef } from "react";
import ProductCard from "@/components/products/ProductCard";
import FilterPanel, {
  type FilterGroup,
  type SelectedFilters,
} from "@/components/products/FilterPanel";

export type CatalogProduct = {
  id: string;
  name: string;
  brand: string;
  targetAudience: string;
  fraganceFamily: string | null;
  concentration: string | null;
  price: number | null;
  image: string | null;
  href: string;
  surface?: "surface" | "surface-alt";
  badge?: string;
};

type SortOption = "name-asc" | "name-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Nombre: A — Z" },
  { value: "name-desc", label: "Nombre: Z — A" },
];

const TARGET_AUDIENCE_MAP: Record<string, string> = {
  masculino: "Masculino",
  femenino: "Femenino",
  unisex: "Unisex",
};

const CONCENTRATION_MAP: Record<string, string> = {
  edp: "Eau de Parfum",
  edt: "Eau de Toilette",
  edc: "Eau de Cologne",
  extrait: "Extrait de Parfum",
};

const INITIAL_FILTERS: SelectedFilters = {
  brand: [],
  targetAudience: [],
  fraganceFamily: [],
  concentration: [],
};

type ProductListingProps = {
  title: string;
  productCount: number;
  products: CatalogProduct[];
  backgroundColor?: string;
  backgroundClass?: string;
  emptyMessage?: string;
  titleClassName?: string;
};

export default function ProductListing({
  title,
  products,
  backgroundColor,
  backgroundClass = "bg-background",
  emptyMessage,
  titleClassName,
}: ProductListingProps) {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(INITIAL_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterGroups = useMemo<FilterGroup[]>(() => {
    const groups: FilterGroup[] = [];

    const uniqueBrands = Array.from(
      new Set(products.map((p) => p.brand).filter(Boolean)),
    ).sort();
    if (uniqueBrands.length > 0) {
      groups.push({
        id: "brand",
        title: "Marca",
        options: uniqueBrands.map((b) => ({ label: b, value: b })),
      });
    }

    const uniqueAudiences = Array.from(
      new Set(products.map((p) => p.targetAudience).filter(Boolean)),
    );
    if (uniqueAudiences.length > 0) {
      groups.push({
        id: "targetAudience",
        title: "Orientación",
        options: uniqueAudiences.map((aud) => ({
          label: TARGET_AUDIENCE_MAP[aud] ?? aud,
          value: aud,
        })),
      });
    }

    const uniqueFamilies = Array.from(
      new Set(
        products
          .map((p) => p.fraganceFamily)
          .filter((f): f is string => Boolean(f)),
      ),
    ).sort();
    if (uniqueFamilies.length > 0) {
      groups.push({
        id: "fraganceFamily",
        title: "Familia Olfativa",
        options: uniqueFamilies.map((f) => ({ label: f, value: f })),
      });
    }

    const uniqueConcentrations = Array.from(
      new Set(
        products
          .map((p) => p.concentration)
          .filter((c): c is string => Boolean(c)),
      ),
    );
    if (uniqueConcentrations.length > 0) {
      groups.push({
        id: "concentration",
        title: "Concentración",
        options: uniqueConcentrations.map((c) => ({
          label: CONCENTRATION_MAP[c] ?? c.toUpperCase(),
          value: c,
        })),
      });
    }

    return groups;
  }, [products]);

  const toggleFilter = (groupId: keyof SelectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[groupId];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [groupId]: next };
    });
  };

  const clearFilters = () => {
    setSelectedFilters(INITIAL_FILTERS);
  };

  const hasActiveFilters =
    selectedFilters.brand.length > 0 ||
    selectedFilters.targetAudience.length > 0 ||
    selectedFilters.fraganceFamily.length > 0 ||
    selectedFilters.concentration.length > 0;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        selectedFilters.brand.length > 0 &&
        !selectedFilters.brand.includes(p.brand)
      ) {
        return false;
      }
      if (
        selectedFilters.targetAudience.length > 0 &&
        !selectedFilters.targetAudience.includes(p.targetAudience)
      ) {
        return false;
      }
      if (
        selectedFilters.fraganceFamily.length > 0 &&
        (!p.fraganceFamily ||
          !selectedFilters.fraganceFamily.includes(p.fraganceFamily))
      ) {
        return false;
      }
      if (
        selectedFilters.concentration.length > 0 &&
        (!p.concentration ||
          !selectedFilters.concentration.includes(p.concentration))
      ) {
        return false;
      }
      return true;
    });
  }, [products, selectedFilters]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [filteredProducts, sortOption]);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sortOption)?.label ?? "Ordenar";

  return (
    <main
      className={`min-h-screen px-4 py-10 md:px-6 md:py-12 ${backgroundColor ? "" : backgroundClass}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <h1 className={`font-serif text-[18px] font-bold leading-6 text-ink md:text-[24px] md:leading-8 ${titleClassName ?? ""}`}>
          {title}
        </h1>

        <div className="pt-4">
          <div className="flex items-center justify-between border-t border-ink/10 pt-4">
            <p className="text-[12px] leading-4 text-muted">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto" : "productos"}
              {hasActiveFilters && products.length !== filteredProducts.length && (
                <span className="ml-1 text-[11px] text-muted/70">
                  (de {products.length})
                </span>
              )}
            </p>

            <div className="flex flex-wrap items-center justify-end gap-3">
              {filterGroups.length > 0 && (
                <button
                  type="button"
                  aria-expanded={isFiltersOpen}
                  onClick={() => setIsFiltersOpen((open) => !open)}
                  className="flex items-center gap-2 border border-ink/15 bg-ink/[0.02] px-3.5 py-2 transition-colors hover:border-ink/35 lg:hidden"
                >
                  <Image
                    src="/icons/icon-filter.svg"
                    alt=""
                    width={12}
                    height={12}
                    className="size-[12px]"
                  />
                  <span className="text-[10px] font-medium uppercase leading-[15px] tracking-[1.8px] text-ink">
                    Filtros
                    {hasActiveFilters && " •"}
                  </span>
                </button>
              )}

              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="flex items-center gap-2 border border-ink/15 bg-ink/[0.02] px-3.5 py-2 transition-colors hover:border-ink/35"
                >
                  <span className="text-[10px] font-medium uppercase leading-[15px] tracking-[1.5px] text-ink">
                    {currentSortLabel}
                  </span>
                  <Image
                    src="/icons/icon-chevron-down.svg"
                    alt=""
                    width={10}
                    height={10}
                    className={`size-[10px] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full z-20 mt-1.5 min-w-[170px] border border-ink/10 bg-background/90 p-1 shadow-sm backdrop-blur-md">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSortOption(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-[11px] uppercase tracking-[1px] transition-colors ${
                          sortOption === opt.value
                            ? "bg-ink/[0.06] font-semibold text-ink"
                            : "text-ink/75 hover:bg-ink/[0.04] hover:text-ink"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortOption === opt.value && (
                          <span className="text-[10px] text-ink">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 flex flex-col gap-6 lg:flex-row lg:gap-10">
          {filterGroups.length > 0 && isFiltersOpen && (
            <div
              className="fixed inset-0 z-10 bg-ink/20 lg:hidden"
              onClick={() => setIsFiltersOpen(false)}
            />
          )}
          {filterGroups.length > 0 && (
            <div
              className={`${
                isFiltersOpen ? "block" : "hidden"
              } absolute inset-x-0 top-0 z-20 max-h-[80vh] overflow-y-auto bg-background p-4 shadow-lg lg:relative lg:block lg:max-h-none lg:w-[220px] lg:shrink-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none`}
            >
              <FilterPanel
                filterGroups={filterGroups}
                selectedFilters={selectedFilters}
                onToggleFilter={toggleFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                onClose={() => setIsFiltersOpen(false)}
              />
            </div>
          )}

          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center border border-dashed border-ink/15 p-8 text-center">
                <p className="font-serif text-[20px] font-semibold text-ink">
                  {emptyMessage ?? "No se encontraron productos"}
                </p>
                <p className="mt-2 max-w-[360px] text-[13px] text-muted">
                  {emptyMessage
                    ? "Intenta con otro término de búsqueda."
                    : "No hay fragancias que coincidan con la combinación de filtros seleccionada en esta categoría."}
                </p>
                {!emptyMessage && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 border border-ink bg-ink px-5 py-2.5 text-[10px] font-medium uppercase tracking-[2px] text-background transition-colors hover:bg-ink/85"
                  >
                    Restablecer filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-14 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    brand={product.brand}
                    name={product.name}
                    badge={product.badge}
                    surface={product.surface}
                    href={product.href}
                    imageClassName="aspect-[3/4]"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
