import ProductCard from "@/components/products/ProductCard";
import { type getPublicFeaturedProducts } from "@/lib/public-data";

type FeaturedProductsProps = {
  products: Awaited<ReturnType<typeof getPublicFeaturedProducts>>;
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {

  if (products.length === 0) return null;

  return (
    <section id="destacados" className="mx-auto w-full max-w-[1280px] px-4 py-16 md:px-6 md:py-24">
      <div>
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
          Los favoritos
        </p>
        <h2 className="mt-3 font-serif text-[30px] leading-9 text-ink md:text-[36px] md:leading-10">
          Destacados
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12 md:gap-6 sm:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            brand={product.brand}
            name={product.name}
            surface="surface"
            href={`/products/${product.id}`}
            imageClassName="aspect-[3/4] md:h-[362px]"
          />
        ))}
      </div>
    </section>
  );
}
