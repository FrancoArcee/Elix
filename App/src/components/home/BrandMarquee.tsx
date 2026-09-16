function BrandRow({ brands }: { brands: { name: string }[] }) {
  return (
    <>
      {brands.map((brand) => (
        <div key={brand.name} className="flex items-center">
          <span className="px-8 text-[10px] uppercase leading-[15px] tracking-[2.8px] text-muted">
            {brand.name}
          </span>
          <span className="text-[12px] leading-4 text-ink/10">·</span>
        </div>
      ))}
    </>
  );
}

export default function BrandMarquee({ brands }: { brands: { name: string }[] }) {
  return (
    <section className="overflow-hidden border-y border-ink/10 py-10">
      <p className="text-center text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
        Variedad de Marcas
      </p>
      <div className="mt-7 flex w-max animate-marquee-slow">
        <BrandRow brands={brands} />
        <BrandRow brands={brands} />
      </div>
    </section>
  );
}
