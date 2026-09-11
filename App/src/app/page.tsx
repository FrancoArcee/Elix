import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import PromoSection from "@/components/home/PromoSection";
import Categories from "@/components/home/Categories";
import BrandMarquee from "@/components/home/BrandMarquee";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getActiveOffer() {
  const offer = await prisma.offer.findFirst({
    where: { active: true },
    include: {
      offerCategories: { include: { category: true } },
      offerPaymentMethods: { include: { paymentMethod: true } },
    },
  })

  if (!offer) return null

  const allCategoryCount = await prisma.category.count()
  const categoryNames = offer.offerCategories.map((oc: { category: { name: string } }) => oc.category.name)
  const isAllCategories = categoryNames.length === allCategoryCount && allCategoryCount > 0

  return {
    discount: Number(offer.discount),
    paymentMethod: offer.offerPaymentMethods[0]?.paymentMethod.method ?? "",
    categories: isAllCategories ? ["Toda la colección"] : categoryNames,
    categoryId: !isAllCategories && offer.offerCategories[0] ? offer.offerCategories[0].category.id : null,
    description: offer.description ?? "",
  }
}

export default async function Home() {
  const offer = await getActiveOffer()

  return (
    <>
      <Navbar />
      <main>
        {offer && <AnnouncementBar offer={offer} />}
        <Hero />
        <Benefits />
        {offer && <PromoSection offer={offer} />}
        <Categories />
        <BrandMarquee />
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  )
}
