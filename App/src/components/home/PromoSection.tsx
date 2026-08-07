import Link from "next/link";

export default function PromoSection() {
  return (
    <section className="bg-ink px-6 py-24">
      <div className="mx-auto flex w-full max-w-[768px] flex-col items-center text-center">
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.6px] text-background/40">
          Oferta activa
        </p>

        <h2 className="mt-7 font-serif text-[40px] font-bold leading-[1.25] text-background md:text-[60px] md:leading-[75px]">
          20% off en toda
          <br />
          la colección.
        </h2>

        <p className="mt-6 max-w-[384px] text-[14px] leading-[22.75px] text-background/55">
          Descuento aplicado sobre todos los perfumes árabes y body splash.
          Hasta agotar stock.
        </p>

        <Link
          href="/products"
          className="mt-11 inline-flex border border-background/30 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[1.8px] text-background transition-colors hover:border-background/60"
        >
          Ver colección
        </Link>
      </div>
    </section>
  );
}
