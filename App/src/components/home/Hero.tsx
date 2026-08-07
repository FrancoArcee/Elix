import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid w-full md:h-[710px] md:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 md:px-14 md:py-20 lg:px-[56px]">
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
          Nueva colección — 2026
        </p>

        <h1 className="mt-8 max-w-[344px] font-serif text-[40px] font-bold leading-[1.03] text-ink md:text-[60px]">
          Descubrí
          <br />
          el arte de
          <br />
          las fragancias
          <br />
          árabes.
        </h1>

        <p className="mt-7 max-w-[340px] text-[14px] leading-[22.75px] text-muted">
          Perfumes árabes originales y body splash de las marcas más exclusivas
          de Oriente Medio, directo a tu puerta.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="bg-ink px-8 py-3.5 text-[10px] font-medium uppercase tracking-[1.8px] text-background transition-opacity hover:opacity-90"
          >
            Explorar colección
          </Link>
          <Link
            href="#destacados"
            className="border border-ink/10 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[1.8px] text-ink transition-colors hover:border-ink/30"
          >
            Ver destacados
          </Link>
        </div>
      </div>

      <div className="relative min-h-[380px] overflow-hidden bg-surface md:min-h-full">
        <Image
          src="/images/hero-coleccion.png"
          alt="Colección de perfumes ELIX"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      </div>
    </section>
  );
}
