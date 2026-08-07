import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductListing from "@/components/products/ProductListing";
import type { ProductCardProps } from "@/components/products/ProductCard";

type ProductsPageProps = {
  searchParams: Promise<{ type?: string }>;
};

const PERFUMES: Omit<ProductCardProps, "key">[] = [
  {
    image: "/images/product-amber-luxe.png",
    brand: "Lattafa",
    name: "Amber Luxe",
    badge: "Oferta",
    outOfStock: true,
    surface: "surface",
    href: "/products/amber-luxe",
  },
  {
    image: "/images/product-oud-royale.png",
    brand: "Lattafa",
    name: "Oud Royale",
    badge: "Más vendido",
    surface: "surface",
    href: "/products/oud-royale",
  },
  {
    image: "/images/product-baccarat-rouge.png",
    brand: "Maison Alhambra",
    name: "Baccarat Rouge",
    badge: "Oferta",
    surface: "surface",
    href: "/products/baccarat-rouge",
  },
  {
    image: "/images/product-noir-intense.png",
    brand: "Ajmal",
    name: "Noir Intense",
    surface: "surface",
    href: "/products/noir-intense",
  },
  {
    image: "/images/product-velvet-rose.png",
    brand: "Swiss Arabian",
    name: "Velvet Rose",
    badge: "Nuevo",
    surface: "surface",
    href: "/products/velvet-rose",
  },
];

const BODY_SPLASH: Omit<ProductCardProps, "key">[] = [
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
  {
    image: "/images/product-sweet-velvet.png",
    brand: "ELIX Collection",
    name: "Sweet Velvet",
    badge: "Nuevo",
    surface: "surface-alt",
    href: "/products/sweet-velvet",
  },
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { type } = await searchParams;
  const isBodySplash = type === "body-splash";

  return (
    <>
      <Navbar
        active={isBodySplash ? "/products?type=body-splash" : "/products"}
        withSearchBar={false}
      />
      {isBodySplash ? (
        <ProductListing
          title="Body Splash"
          productCount={BODY_SPLASH.length}
          products={BODY_SPLASH}
          backgroundClass="bg-[#fff4ed]"
        />
      ) : (
        <ProductListing
          title="Perfumes Árabes"
          productCount={PERFUMES.length}
          products={PERFUMES}
        />
      )}
      <Footer />
    </>
  );
}
