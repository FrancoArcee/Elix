import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import PromoSection from "@/components/home/PromoSection";
import Categories from "@/components/home/Categories";
import BrandMarquee from "@/components/home/BrandMarquee";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { getPublicHomeData } from "@/lib/public-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { offer, categories, hero, featuredProducts, contacts } = await getPublicHomeData();
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  const navbarCategories = categories.map((c) => ({
    label: c.name,
    href: `/products?categoryId=${c.id}`,
  }));

  return (
    <>
      <Navbar categories={navbarCategories} />
      <main>
        <div className="flex min-h-[calc(100dvh-60px)] flex-col md:min-h-0 md:block">
          {offer && <AnnouncementBar offer={offer} />}
          <Hero hero={hero} />
        </div>
        <Benefits />
        {offer && <PromoSection offer={offer} />}
        <Categories categories={categories} />
        <BrandMarquee brands={brands} />
        <FeaturedProducts products={featuredProducts} />
      </main>
      <Footer contacts={contacts} />
    </>
  )
}
