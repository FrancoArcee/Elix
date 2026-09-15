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
  searchParams: Promise<{ categoryId?: string; search?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { categoryId, search } = await searchParams;

  if (!categoryId && !search) {
    redirect("/");
  }

  if (categoryId) {
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
            badge: p.badge ?? undefined,
            price: p.price ? Number(p.price) : null,
            image: p.images[0]?.imageUrl ?? null,
            surface: "surface" as const,
            href: `/products/${p.id}`,
          }))}
        />
        <Footer />
      </>
    );
  }

  const searchQuery = search!.trim();

  const searchWhere: Prisma.ProductWhereInput = {
    OR: [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { brand: { name: { contains: searchQuery, mode: "insensitive" } } },
      { notes: { some: { note: { name: { contains: searchQuery, mode: "insensitive" } } } } },
    ],
  };

  const exactResults = (await prisma.product.findMany({
    where: searchWhere,
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  })) as ProductWithRelations[];

  let products = exactResults;
  let isSimilar = false;

  if (products.length === 0) {
    const similarProducts = (await prisma.product.findMany({
      where: {
        OR: [
          { category: { name: { contains: searchQuery, mode: "insensitive" } } },
          { fraganceFamily: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
      },
      orderBy: { name: "asc" },
      take: 12,
    })) as ProductWithRelations[];

    if (similarProducts.length > 0) {
      products = similarProducts;
      isSimilar = true;
    }
  }

  const title = exactResults.length > 0
    ? `Resultados para "${searchQuery}"`
    : isSimilar
      ? `Resultados para "${searchQuery}"`
      : `No se encontraron resultados para "${searchQuery}"`;

  const showEmptyMessage = exactResults.length === 0 && !isSimilar;

  return (
    <>
      <Navbar active="/" withSearchBar={false} />
      <ProductListing
        title={title}
        productCount={products.length}
        emptyMessage={showEmptyMessage ? title : undefined}
        backgroundClass="bg-surface"
        titleClassName="text-muted"
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand.name,
          targetAudience: p.targetAudience,
          fraganceFamily: p.fraganceFamily,
          concentration: p.concentration,
          badge: p.badge ?? undefined,
          price: p.price ? Number(p.price) : null,
          image: p.images[0]?.imageUrl ?? null,
          surface: "surface" as const,
          href: `/products/${p.id}`,
        }))}
      />
      <Footer />
    </>
  );
}
