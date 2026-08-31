import Image from "next/image";
import Link from "next/link";
import ProductCard, { type ProductCardProps } from "@/components/products/ProductCard";

const FEATURED_PRODUCTS: Omit<ProductCardProps, "key">[] = [
  {
    image: "/images/product-oud-royale.png",
    brand: "Lattafa",
    name: "Oud Royale",
    badge: "Más vendido",
    surface: "surface",
    href: "/products/oud-royale",
  },
  {
    image: "/images/product-velvet-rose.png",
    brand: "Swiss Arabian",
    name: "Velvet Rose",
    badge: "Nuevo",
    surface: "surface",
    href: "/products/velvet-rose",
  },
  {
    image: "/images/product-bloom-bliss.png",
    brand: "ELIX Collection",
    name: "Bloom Bliss",
    badge: "Más vendido",
    surface: "surface-alt",
    href: "/products/bloom-bliss",
  },
  {
    image: "/images/product-fresh-bloom.png",
    brand: "ELIX Collection",
    name: "Fresh Bloom",
    surface: "surface-alt",
    href: "/products/fresh-bloom",
  },
];

export default function FeaturedProducts() {
  return (
    <section id="destacados" className="mx-auto w-full max-w-[1280px] px-4 py-16 md:px-6 md:py-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
            Los favoritos
          </p>
          <h2 className="mt-3 font-serif text-[30px] leading-9 text-ink md:text-[36px] md:leading-10">
            Destacados
          </h2>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[1.8px] text-muted transition-colors hover:text-ink"
        >
          Ver todos
          <Image
            src="/icons/icon-arrow.svg"
            alt=""
            width={11}
            height={11}
            className="size-[11px]"
          />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12 md:gap-6 sm:grid-cols-3">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard
            key={product.name}
            {...product}
            imageClassName="aspect-[3/4] md:h-[362px]"
          />
        ))}
      </div>
    </section>
  );
}
