const BRANDS = [
  "Lattafa",
  "Swiss Arabian",
  "Maison Alhambra",
  "Ajmal",
  "Al Haramain",
  "Rasasi",
  "ELIX Collection",
  "Arabian Oud",
];

function BrandRow() {
  return (
    <>
      {BRANDS.map((brand, index) => (
        <div key={`${brand}-${index}`} className="flex items-center">
          <span className="px-8 text-[10px] uppercase leading-[15px] tracking-[2.8px] text-muted">
            {brand}
          </span>
          <span className="text-[12px] leading-4 text-ink/10">·</span>
        </div>
      ))}
    </>
  );
}

export default function BrandMarquee() {
  return (
    <section className="overflow-hidden border-y border-ink/10 py-10">
      <p className="text-center text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
        Variedad de Marcas
      </p>
      <div className="mt-7 flex w-max animate-marquee-slow">
        <BrandRow />
        <BrandRow />
      </div>
    </section>
  );
}
