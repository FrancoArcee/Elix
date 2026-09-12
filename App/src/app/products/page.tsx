import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductListing from "@/components/products/ProductListing";
import { intToHex } from "@/lib/colors";

export const dynamic = "force-dynamic";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { brand: true; category: true; images: true };
}>;

type ProductsPageProps = {
  searchParams: Promise<{ categoryId?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { categoryId } = await searchParams;

  if (!categoryId) {
    redirect("/");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    redirect("/");
  }

  const products = (await prisma.product.findMany({
    where: { categoryId: category.id },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  })) as ProductWithRelations[];

  return (
    <>
      <Navbar
        active={`/products?categoryId=${category.id}`}
        withSearchBar={false}
      />
      <ProductListing
        title={category.name}
        productCount={products.length}
        backgroundColor={intToHex(category.color)}
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand.name,
          targetAudience: p.targetAudience,
          fraganceFamily: p.fraganceFamily,
          concentration: p.concentration,
          price: p.price ? Number(p.price) : null,
          image: p.images[0]?.imageUrl ?? "/images/product-oud-royale.png",
          surface: "surface" as const,
          href: `/products/${p.id}`,
        }))}
      />
      <Footer />
    </>
  );
}
