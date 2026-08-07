import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import PromoSection from "@/components/home/PromoSection";
import Categories from "@/components/home/Categories";
import BrandMarquee from "@/components/home/BrandMarquee";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <AnnouncementBar />
        <Hero />
        <Benefits />
        <PromoSection />
        <Categories />
        <BrandMarquee />
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  );
}
