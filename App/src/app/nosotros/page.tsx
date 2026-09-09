import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BASE_URL } from "@/lib/base-url";
import type { InformationSection } from "@/services/information";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    number: "01",
    title: "Explorás el catálogo",
    description:
      "Navegás los productos y encontrás la fragancia que te llama la atención.",
  },
  {
    number: "02",
    title: "Consultás desde el producto",
    description:
      "Dentro de cada producto hay un botón para enviarnos un mensaje directo. Con un toque nos avisás cuál te interesa.",
  },
  {
    number: "03",
    title: "Nosotros nos encargamos",
    description:
      "Te asesoramos, confirmamos disponibilidad y coordinamos la entrega. Simple, directo y sin vueltas.",
  },
];

export default async function NosotrosPage() {
  const res = await fetch(`${BASE_URL}/api/information`, { cache: "no-store" });
  const sections: InformationSection[] = res.ok ? await res.json() : [];

  const [header, ...rest] = sections;

  return (
    <>
      <Navbar active="/nosotros" withSearchBar={false} />
      <main className="mx-auto w-full max-w-[896px] px-4 py-16 md:px-6 md:py-24">
        {header ? (
          <>
            <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
              {header.label}
            </p>
            <h1 className="mt-4 font-serif text-[36px] font-bold leading-[45px] text-ink md:text-[60px] md:leading-[75px]">
              {header.title}
            </h1>
            <p className="mt-8 max-w-[576px] text-[16px] leading-[26px] text-muted">
              {header.description}
            </p>
          </>
        ) : null}

        {rest.map((section) => (
          <div key={section.id}>
            <div className="mt-16 border-t border-ink/10 md:mt-20" />
            <section className="mt-16 md:mt-20">
              <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
                {section.label}
              </p>
              <div className="mt-10 grid grid-cols-1 items-center gap-14 md:grid-cols-2">
                {section.imageUrl ? (
                  <div className="relative aspect-[3/2] w-full overflow-hidden md:h-[278px]">
                    <Image
                      src={section.imageUrl}
                      alt={section.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 448px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[3/2] w-full flex-col items-center justify-center gap-3 border border-dashed border-ink/10 bg-surface md:aspect-auto md:h-[278px]">
                    <div className="flex size-14 items-center justify-center rounded-full border border-dashed border-muted/30">
                      <Image
                        src="/icons/icon-team-user.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="size-5"
                      />
                    </div>
                    <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.25px] text-muted/50">
                      Sin imagen
                    </p>
                  </div>
                )}
                <div>
                  <h2 className="font-serif text-[30px] font-bold leading-[37.5px] text-ink md:text-[36px] md:leading-[45px]">
                    {section.title}
                  </h2>
                  <p className="mt-5 max-w-[396px] text-[14px] leading-[22.75px] text-muted">
                    {section.description}
                  </p>
                </div>
              </div>
            </section>
          </div>
        ))}

        <div className="mt-16 border-t border-ink/10 md:mt-20" />

        <section className="mt-16 md:mt-20">
          <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
            Cómo comprar
          </p>
          <h2 className="mt-6 font-serif text-[30px] font-bold leading-[37.5px] text-ink md:text-[36px] md:leading-[45px]">
            <span className="block">Sin carritos.</span>
            <span className="block">Sin formularios.</span>
            <span className="block">Solo una consulta.</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 border border-ink/10 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.number}
                className={`p-8 ${
                  index < 2
                    ? "border-b border-ink/10 md:border-b-0 md:border-r"
                    : ""
                }`}
              >
                <p className="font-serif text-[30px] font-bold leading-9 text-ink/15">
                  {step.number}
                </p>
                <p className="pt-4 text-[14px] font-medium leading-5 text-ink">
                  {step.title}
                </p>
                <p className="pt-2 text-[12px] leading-[19.5px] text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center md:mt-20">
          <p className="text-[14px] leading-5 text-muted">
            ¿Encontraste algo que te gustó?
          </p>
          <Link
            href="/#categorias"
            className="mx-auto mt-6 flex h-[43px] w-full max-w-[159px] items-center justify-center bg-ink"
          >
            <span className="text-[10px] font-medium uppercase leading-[15px] tracking-[1.8px] text-background">
              Ver catálogo
            </span>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
