"use client";

import Image from "next/image";
import { useState } from "react";
import ProductCard, {
  type ProductCardProps,
} from "@/components/products/ProductCard";
import FilterPanel from "@/components/products/FilterPanel";

type ProductListingProps = {
  title: string;
  productCount: number;
  products: Omit<ProductCardProps, "key">[];
  backgroundClass?: string;
};

export default function ProductListing({
  title,
  productCount,
  products,
  backgroundClass = "bg-background",
}: ProductListingProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <main className={`min-h-screen px-4 py-10 md:px-6 md:py-12 ${backgroundClass}`}>
      <div className="mx-auto w-full max-w-[1280px]">
        <h1 className="font-serif text-[30px] font-bold leading-9 text-ink md:text-[36px] md:leading-10">
          {title}
        </h1>

        <div className="pt-4">
          <div className="flex items-center justify-between border-t border-ink/10 pt-4">
            <p className="text-[12px] leading-4 text-muted">
              {productCount}{" "}
              {productCount === 1 ? "producto" : "productos"}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                aria-expanded={isFiltersOpen}
                onClick={() => setIsFiltersOpen((open) => !open)}
                className="flex items-center gap-2 border border-ink/10 px-3 py-2 lg:hidden"
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
                </span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 border border-ink/10 px-3 py-2"
              >
                <span className="text-[10px] font-medium uppercase leading-[15px] tracking-[1.5px] text-ink">
                  Más vendidos
                </span>
                <Image
                  src="/icons/icon-chevron-down.svg"
                  alt=""
                  width={10}
                  height={10}
                  className="size-[10px]"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-10">
          <div
            className={`${
              isFiltersOpen ? "block" : "hidden"
            } w-full lg:block lg:w-[208px] lg:shrink-0`}
          >
            <FilterPanel onClose={() => setIsFiltersOpen(false)} />
          </div>
          <div className="grid flex-1 grid-cols-1 gap-4 pb-14 sm:grid-cols-2 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.href}
                {...product}
                imageClassName="aspect-[3/4]"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
