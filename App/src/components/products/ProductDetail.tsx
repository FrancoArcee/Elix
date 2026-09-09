"use client";

import Image from "next/image";
import { useState } from "react";
import ProductCard, {
  type ProductCardProps,
} from "@/components/products/ProductCard";

export type ProductBenefit = {
  icon: string;
  text: string;
};

export type OlfactoryGroup = {
  label: string;
  notes: string[];
};

export type ProductDetailProps = {
  brand: string;
  name: string;
  image: string;
  images?: string[];
  sizes: string[];
  defaultSize?: string;
  benefits: ProductBenefit[];
  olfactoryNotes: OlfactoryGroup[];
  description?: string;
  characteristics?: string[];
  related: Omit<ProductCardProps, "key">[];
};

const TABS = ["Notas Olfativas", "Descripción", "Características"] as const;

type Tab = (typeof TABS)[number];

export default function ProductDetail({
  brand,
  name,
  image,
  images,
  sizes,
  defaultSize = sizes[0],
  benefits,
  olfactoryNotes,
  description,
  characteristics,
  related,
}: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [activeTab, setActiveTab] = useState<Tab>("Notas Olfativas");

  const galleryImages = images?.length
    ? images
    : Array.from({ length: 4 }, () => image);

  return (
    <>
      <main className="bg-background">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-12">
          <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-2">
            <div className="flex flex-col">
              <div className="relative aspect-square w-full overflow-hidden bg-surface">
                <Image
                  src={galleryImages[activeImage]}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className={`grid gap-2 pt-3 ${galleryImages.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Imagen ${i + 1} de ${name}`}
                    className={`relative aspect-square overflow-hidden bg-surface transition-opacity ${
                      i === activeImage
                        ? "shadow-[0_0_0_1px_#0c0c0b]"
                        : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 25vw, 12.5vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="pb-3 text-[9px] uppercase leading-[13.5px] tracking-[2.7px] text-muted">
                {brand}
              </p>
              <h1 className="pb-10 font-serif text-[34px] font-bold leading-[42px] text-ink md:text-[48px] md:leading-[60px]">
                {name}
              </h1>

              <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.25px] text-ink">
                <span>Tamaño — </span>
                <span className="text-[11px] leading-[16.5px] text-muted">
                  {selectedSize}
                </span>
              </p>
              <div className="flex flex-wrap gap-2 pt-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border-[0.667px] px-4 py-2.5 text-[12px] font-medium leading-4 transition-colors ${
                      size === selectedSize
                        ? "border-ink bg-ink text-background"
                        : "border-ink/10 bg-background text-ink hover:border-ink/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="mt-8 flex w-full items-center justify-center gap-2 bg-ink py-4 transition-colors hover:bg-ink/90"
              >
                <Image
                  src="/icons/icon-chat-white.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="size-[14px]"
                />
                <span className="text-[10px] font-medium uppercase leading-[15px] tracking-[1.8px] text-background">
                  Consultar por este producto
                </span>
              </button>

              <div className="pt-8">
                <div className="border-t border-ink/10 pt-7">
                  {benefits.map((benefit, i) => (
                    <div
                      key={benefit.text}
                      className={`flex items-center gap-3 ${
                        i > 0 ? "pt-3" : ""
                      }`}
                    >
                      <Image
                        src={benefit.icon}
                        alt=""
                        width={13}
                        height={13}
                        className="size-[13px]"
                      />
                      <p className="text-[12px] leading-4 text-muted">
                        {benefit.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20">
            <div className="border-t border-ink/10">
              <div className="flex gap-8 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap border-b-2 py-6 text-[10px] font-medium uppercase tracking-[1.8px] transition-colors ${
                      activeTab === tab
                        ? "border-ink text-ink"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-12">
                {activeTab === "Notas Olfativas" &&
                  (olfactoryNotes.length > 0 ? (
                    <div className="grid max-w-[672px] grid-cols-1 gap-10 sm:grid-cols-3">
                      {olfactoryNotes.map((group) => (
                        <div key={group.label}>
                          <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.7px] text-muted">
                            {group.label}
                          </p>
                          <div className="pt-5">
                            {group.notes.map((note, i) => (
                              <p
                                key={note}
                                className={`text-[14px] leading-5 text-ink ${
                                  i > 0 ? "pt-2" : ""
                                }`}
                              >
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="max-w-[672px] text-[14px] leading-6 text-muted">
                      Notas olfativas próximamente disponibles.
                    </p>
                  ))}

                {activeTab === "Descripción" && (
                  <p className="max-w-[672px] text-[14px] leading-6 text-ink">
                    {description ??
                      "Descripción próximamente disponible."}
                  </p>
                )}

                {activeTab === "Características" &&
                  (characteristics && characteristics.length > 0 ? (
                    <ul className="max-w-[672px] space-y-2">
                      {characteristics.map((item) => (
                        <li
                          key={item}
                          className="text-[14px] leading-5 text-ink"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="max-w-[672px] text-[14px] leading-6 text-muted">
                      Características próximamente disponibles.
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div className="border-t border-ink/10 pt-16">
            <h2 className="font-serif text-[24px] leading-8 text-ink">
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((product) => (
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
    </>
  );
}
