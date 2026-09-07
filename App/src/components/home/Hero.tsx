import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Hero() {
  const hero = await prisma.hero.findFirst()

  if (!hero) return null

  return (
    <section className="relative w-full md:h-[710px] md:grid md:grid-cols-2">
      <div aria-hidden className="absolute inset-0 md:hidden">
        <Image
          src={hero.imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
      </div>

      <div className="relative z-10 flex min-h-[600px] flex-col justify-end px-6 pb-12 pt-32 text-white md:min-h-full md:justify-center md:px-14 md:py-20 md:text-ink lg:px-[56px]">
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-white/55 md:text-muted">
          {hero.kicker}
        </p>

        <h1 className="mt-5 max-w-[344px] font-serif text-[40px] font-bold leading-[41px] text-white md:mt-8 md:leading-[1.03] md:text-ink md:text-[60px]">
          {hero.title}
        </h1>

        <p className="mt-5 max-w-[340px] text-[14px] leading-[22.75px] text-white/60 md:mt-7 md:text-muted">
          Perfumes árabes originales y body splash de las marcas más exclusivas
          de Oriente Medio, directo a tu puerta.
        </p>

        <div className="mt-9 flex w-full flex-col gap-3 md:mt-10 md:w-auto md:flex-row">
          <Link
            href="/products"
            className="w-full bg-background px-8 py-4 text-center text-[10px] font-medium uppercase tracking-[1.8px] text-ink transition-opacity hover:opacity-90 md:w-auto md:bg-ink md:py-3.5 md:text-background"
          >
            Explorar colección
          </Link>
          <Link
            href="#destacados"
            className="w-full border border-white/35 px-8 py-4 text-center text-[10px] font-medium uppercase tracking-[1.8px] text-white transition-colors hover:border-white/60 md:w-auto md:border-ink/10 md:py-3.5 md:text-ink md:hover:border-ink/30"
          >
            Ver destacados
          </Link>
        </div>
      </div>

      <div className="relative hidden min-h-full overflow-hidden bg-surface md:block">
        <Image
          src={hero.imageUrl}
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
