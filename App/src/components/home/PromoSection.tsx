"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const AUTOPLAY_MS = 6000;

type PromoOffer = {
  discount: number;
  categories: string[];
  categoryId?: string | null;
  description: string;
};

type PromoSectionProps = {
  offers: PromoOffer[];
};

export default function PromoSection({ offers }: PromoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollToOffer = (next: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  };

  useEffect(() => {
    if (offers.length < 2) return;
    const timer = setInterval(
      () => scrollToOffer((index + 1) % offers.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(timer);
  }, [index, offers.length]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setIndex(Math.max(0, Math.min(next, offers.length - 1)));
  };

  return (
    <section className="bg-ink px-4 py-20 md:px-6 md:py-24">
      <div className="mx-auto w-full max-w-[768px]">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {offers.map((offer, i) => {
            const isAllCategories = offer.categories.includes("Toda la colección");
            const href = isAllCategories || !offer.categoryId
              ? "#categorias"
              : `/products?categoryId=${offer.categoryId}`;

            return (
              <div
                key={i}
                className="flex w-full shrink-0 snap-start flex-col items-center text-center"
              >
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
                  href={href}
                  className="mt-11 inline-flex border border-background/30 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[1.8px] text-background transition-colors hover:border-background/60"
                >
                  Ver colección
                </Link>
              </div>
            );
          })}
        </div>

        {offers.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            {offers.map((offer, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ver oferta ${i + 1}`}
                aria-current={i === index}
                onClick={() => scrollToOffer(i)}
                className={`size-2 rounded-full transition-colors ${
                  i === index
                    ? "bg-background"
                    : "bg-background/30 hover:bg-background/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}