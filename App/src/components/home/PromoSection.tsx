import Link from "next/link";

type PromoSectionProps = {
  offer: {
    discount: number;
    categories: string[];
    description: string;
  };
};

export default function PromoSection({ offer }: PromoSectionProps) {
  const isAllCategories = offer.categories.includes("Toda la colección");

  return (
    <section className="bg-ink px-4 py-20 md:px-6 md:py-24">
      <div className="mx-auto flex w-full max-w-[768px] flex-col items-center text-center">
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.6px] text-background/40">
          Oferta activa
        </p>

        <h2 className="mt-7 font-serif text-[36px] font-bold leading-[45px] text-background md:mt-7 md:text-[60px] md:leading-[75px]">
          {isAllCategories ? (
            <>
              {offer.discount}% off en toda<span className="hidden md:inline"> </span>
              <br className="hidden md:block" />
              la colección.
            </>
          ) : (
            <>
              {offer.discount}% off en {offer.categories[0]}<span className="hidden md:inline"> </span>
              <br className="hidden md:block" />
            </>
          )}
        </h2>

        <p className="mt-6 max-w-[384px] text-[14px] leading-[22.75px] text-background/55">
          {offer.description}
        </p>

        <Link
          href={isAllCategories ? "/products" : `/products?type=${encodeURIComponent(offer.categories[0])}`}
          className="mt-11 inline-flex border border-background/30 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[1.8px] text-background transition-colors hover:border-background/60"
        >
          Ver colección
        </Link>
      </div>
    </section>
  );
}
