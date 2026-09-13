"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminHeading from "@/components/admin/AdminHeading";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import FilterChip from "@/components/admin/FilterChip";
import AdminProductCard from "@/components/admin/AdminProductCard";
import { useAdminStore } from "@/context/adminStore";

const CONCENTRATION_MAP: Record<string, string> = {
  edp: "Eau de Parfum",
  edt: "Eau de Toilette",
  edc: "Eau de Cologne",
  extrait: "Extrait de Parfum",
};

const MAX_FEATURED = 6;

export default function AdminProductsPage() {
  const products = useAdminStore((state) => state.products);
  const featured = useAdminStore((state) => state.featured);
  const categories = useAdminStore((state) => state.categories);
  const fetchProducts = useAdminStore((state) => state.fetchProducts);
  const fetchFeatured = useAdminStore((state) => state.fetchFeatured);
  const fetchCategories = useAdminStore((state) => state.fetchCategories);
  const addFeatured = useAdminStore((state) => state.addFeatured);
  const removeFeatured = useAdminStore((state) => state.removeFeatured);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Todas");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedOrientations, setSelectedOrientations] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchFeatured();
    fetchCategories();
  }, [fetchProducts, fetchFeatured, fetchCategories]);

  const featuredIds = useMemo(
    () => new Set(featured.map((f) => f.productId)),
    [featured],
  );

  const categoryOptions = useMemo(() => {
    const list = categories.map((c) => c.name);
    return ["Todas", ...(list.length > 0 ? list : ["Perfumes Árabes", "Body Splash"])];
  }, [categories]);

  const scopeProducts = useMemo(() => {
    let list = category === "Todas" ? products : products.filter((p) => p.category === category);
    if (onlyFeatured) {
      list = list.filter((p) => featuredIds.has(p.id));
    }
    return list;
  }, [products, category, onlyFeatured, featuredIds]);

  const availableBrands = useMemo(() => {
    return Array.from(
      new Set(scopeProducts.map((p) => p.brand).filter(Boolean)),
    ).sort();
  }, [scopeProducts]);

  const availableOrientations = useMemo(() => {
    return Array.from(
      new Set(scopeProducts.map((p) => p.orientation).filter(Boolean)),
    ) as string[];
  }, [scopeProducts]);

  const availableFamilies = useMemo(() => {
    return Array.from(
      new Set(
        scopeProducts
          .map((p) => p.fraganceFamily)
          .filter((f): f is string => Boolean(f)),
      ),
    ).sort();
  }, [scopeProducts]);

  const availableConcentrations = useMemo(() => {
    return Array.from(
      new Set(
        scopeProducts
          .map((p) => p.concentration)
          .filter((c): c is string => Boolean(c)),
      ),
    );
  }, [scopeProducts]);

  const toggleFilter = (
    value: string,
    selected: string[],
    setSelected: (fn: (prev: string[]) => string[]) => void,
  ) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const clearFilters = () => {
    setOnlyFeatured(false);
    setSelectedBrands([]);
    setSelectedOrientations([]);
    setSelectedFamilies([]);
    setSelectedConcentrations([]);
  };

  const handleSelectCategory = (newCategory: string) => {
    setCategory(newCategory);
    setSelectedBrands([]);
    setSelectedOrientations([]);
    setSelectedFamilies([]);
    setSelectedConcentrations([]);
  };

  const hasActiveFilters =
    onlyFeatured ||
    selectedBrands.length > 0 ||
    selectedOrientations.length > 0 ||
    selectedFamilies.length > 0 ||
    selectedConcentrations.length > 0;

  const totalActiveFilterCount =
    (onlyFeatured ? 1 : 0) +
    selectedBrands.length +
    selectedOrientations.length +
    selectedFamilies.length +
    selectedConcentrations.length;

  const filteredProducts = useMemo(() => {
    return scopeProducts.filter((product) => {
      const matchesSearch =
        !search.trim() ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      const matchesOrientation =
        selectedOrientations.length === 0 ||
        (product.orientation && selectedOrientations.includes(product.orientation));

      const matchesFamily =
        selectedFamilies.length === 0 ||
        (product.fraganceFamily && selectedFamilies.includes(product.fraganceFamily));

      const matchesConcentration =
        selectedConcentrations.length === 0 ||
        (product.concentration && selectedConcentrations.includes(product.concentration));

      return (
        matchesSearch &&
        matchesBrand &&
        matchesOrientation &&
        matchesFamily &&
        matchesConcentration
      );
    });
  }, [
    scopeProducts,
    search,
    selectedBrands,
    selectedOrientations,
    selectedFamilies,
    selectedConcentrations,
  ]);

  function handleToggleFeatured(productId: string) {
    if (featuredIds.has(productId)) {
      removeFeatured(productId);
    } else if (featuredIds.size < MAX_FEATURED) {
      addFeatured(productId);
    }
  }

  const hasAnyFilterOptions =
    availableBrands.length > 0 ||
    availableOrientations.length > 0 ||
    availableFamilies.length > 0 ||
    availableConcentrations.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Productos" backHref="/admin" />
      <main className="flex-1 px-6 py-8 md:px-10">
        <AdminHeading
          title="Productos"
          actionLabel="+ Agregar"
          actionHref="/admin/products/new"
        />

        <div className="pt-6">
          <AdminSearchInput value={search} onChange={setSearch} />
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {categoryOptions.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                active={category === filter}
                onClick={() => handleSelectCategory(filter)}
              />
            ))}

            <div className="mx-0.5 h-4 w-px bg-ink/10" />

            <FilterChip
              label="Destacados"
              active={onlyFeatured}
              onClick={() => {
                setOnlyFeatured((prev) => !prev);
                setSelectedBrands([]);
                setSelectedOrientations([]);
                setSelectedFamilies([]);
                setSelectedConcentrations([]);
              }}
            />
          </div>

          {hasAnyFilterOptions && (
            <div className="ml-auto flex items-center justify-end gap-3 self-end sm:self-auto">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="whitespace-nowrap text-[11px] font-medium text-muted underline underline-offset-2 transition-colors hover:text-ink"
                >
                  Limpiar filtros
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsFiltersOpen((prev) => !prev)}
                className={`flex shrink-0 items-center gap-2 border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[1.5px] transition-colors ${
                  isFiltersOpen || hasActiveFilters
                    ? "border-ink bg-ink text-background"
                    : "border-ink/15 bg-transparent text-ink hover:border-ink/35"
                }`}
              >
                <Image
                  src="/icons/icon-filter.svg"
                  alt=""
                  width={11}
                  height={11}
                  className={`size-[11px] ${
                    isFiltersOpen || hasActiveFilters ? "invert" : ""
                  }`}
                />
                <span>
                  Filtros
                  {totalActiveFilterCount > 0 && ` (${totalActiveFilterCount})`}
                </span>
              </button>
            </div>
          )}
        </div>

        {isFiltersOpen && hasAnyFilterOptions && (
          <div className="mt-4 space-y-4 border border-ink/10 bg-ink/[0.02] p-5">
            {availableBrands.length > 0 && (
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[2px] text-ink">
                  Marca
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {availableBrands.map((brand) => (
                    <FilterChip
                      key={brand}
                      label={brand}
                      active={selectedBrands.includes(brand)}
                      onClick={() =>
                        toggleFilter(brand, selectedBrands, setSelectedBrands)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {availableOrientations.length > 0 && (
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[2px] text-ink">
                  Orientación
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {availableOrientations.map((orientation) => (
                    <FilterChip
                      key={orientation}
                      label={orientation}
                      active={selectedOrientations.includes(orientation)}
                      onClick={() =>
                        toggleFilter(
                          orientation,
                          selectedOrientations,
                          setSelectedOrientations,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {availableFamilies.length > 0 && (
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[2px] text-ink">
                  Familia Olfativa
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {availableFamilies.map((family) => (
                    <FilterChip
                      key={family}
                      label={family}
                      active={selectedFamilies.includes(family)}
                      onClick={() =>
                        toggleFilter(
                          family,
                          selectedFamilies,
                          setSelectedFamilies,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {availableConcentrations.length > 0 && (
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[2px] text-ink">
                  Concentración
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {availableConcentrations.map((concentration) => (
                    <FilterChip
                      key={concentration}
                      label={CONCENTRATION_MAP[concentration] ?? concentration.toUpperCase()}
                      active={selectedConcentrations.includes(concentration)}
                      onClick={() =>
                        toggleFilter(
                          concentration,
                          selectedConcentrations,
                          setSelectedConcentrations,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="pt-6 text-[10px] leading-[15px] text-muted">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto" : "productos"}
          {hasActiveFilters && filteredProducts.length !== products.length && (
            <span className="ml-1 text-muted/70">
              (de {products.length})
            </span>
          )}
          {featuredIds.size > 0 && (
            <> · {featuredIds.size} destacado{featuredIds.size !== 1 && "s"}</>
          )}
        </p>

        {filteredProducts.length === 0 ? (
          <div className="mx-auto mt-6 flex max-w-[960px] flex-col items-center justify-center border border-dashed border-ink/15 p-10 text-center">
            <p className="font-serif text-[18px] font-semibold text-ink">
              No se encontraron productos
            </p>
            <p className="mt-2 max-w-[340px] text-[13px] text-muted">
              No hay productos que coincidan con la búsqueda o combinación de filtros en esta vista.
            </p>
            {(hasActiveFilters || search.trim()) && (
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setSearch("");
                }}
                className="mt-4 border border-ink bg-ink px-4 py-2 text-[10px] font-medium uppercase tracking-[1.5px] text-background transition-colors hover:bg-ink/85"
              >
                Restablecer búsqueda y filtros
              </button>
            )}
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-[960px] grid-cols-2 gap-3 pt-4 pb-14 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
            {filteredProducts.map((product) => (
              <AdminProductCard
                key={product.id}
                image={product.image ?? null}
                brand={product.brand}
                name={product.name}
                badge={product.badge}
                href={`/admin/products/${product.id}`}
                isFeatured={featuredIds.has(product.id)}
                onToggleFeatured={() => handleToggleFeatured(product.id)}
                featuredDisabled={featuredIds.size >= MAX_FEATURED}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
