import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import PromoSection from "@/components/home/PromoSection";
import Categories from "@/components/home/Categories";
import BrandMarquee from "@/components/home/BrandMarquee";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicHomeData } from "@/lib/public-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://elixfragancias.com.ar";

export const metadata: Metadata = {
  title: {
    absolute: "ELIX — Perfumería Árabe",
  },
  description:
    "Descubrí nuestra colección de perfumes árabes originales: body splash, perfumes y fragancias exclusivas de las mejores marcas de Oriente Medio.",
  openGraph: {
    title: "ELIX — Perfumería Árabe",
    description: "Perfumes árabes originales de marcas exclusivas.",
    images: ["/og-image.png"],
  },
};

export default async function Home() {
  const { offers, categories, hero, featuredProducts, contacts } = await getPublicHomeData();
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  const navbarCategories = categories.map((c) => ({
    label: c.name,
    href: `/products?categoryId=${c.id}`,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "ELIX",
          description: "Perfumería árabe — fragancias exclusivas de Oriente Medio.",
          url: baseUrl,
          logo: `${baseUrl}/og-image.png`,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ELIX",
          url: baseUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${baseUrl}/products?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar categories={navbarCategories} />
      <main>
        <div className="flex min-h-[calc(100dvh-60px)] flex-col md:min-h-0 md:block">
          {offers.length > 0 && <AnnouncementBar offers={offers} />}
          <Hero hero={hero} />
        </div>
        <Benefits />
        {offers.length > 0 && <PromoSection offers={offers} />}
        <Categories categories={categories} />
        <BrandMarquee brands={brands} />
        <FeaturedProducts products={featuredProducts} />
      </main>
      <Footer contacts={contacts} />
    </>
  )
}
