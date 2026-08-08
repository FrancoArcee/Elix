import Image from "next/image";
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
  return (
    <main className={`min-h-screen px-6 py-12 ${backgroundClass}`}>
      <div className="mx-auto w-full max-w-[1280px]">
        <h1 className="font-serif text-[36px] font-bold leading-10 text-ink">
          {title}
        </h1>

        <div className="pt-4">
          <div className="flex items-center justify-between border-t border-ink/10 pt-4">
            <p className="text-[12px] leading-4 text-muted">
              {productCount}{" "}
              {productCount === 1 ? "producto" : "productos"}
            </p>
            <button
              type="button"
              className="flex items-center gap-2 border-[0.667px] border-ink/10 px-3 py-2"
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

        <div className="mt-6 flex flex-col gap-10 lg:flex-row">
          <FilterPanel className="w-full shrink-0 lg:w-[208px]" />
          <div className="grid flex-1 grid-cols-1 gap-6 pb-14 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard
                key={product.name}
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
