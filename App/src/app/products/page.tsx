import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductListing from "@/components/products/ProductListing";
import JsonLd from "@/components/seo/JsonLd";
import { intToHex } from "@/lib/colors";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://elixfragancias.com.ar";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { brand: true; category: true; images: true };
}>;

type ProductsPageProps = {
  searchParams: Promise<{ categoryId?: string; search?: string }>;
};

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { categoryId, search } = await searchParams;

  if (search) {
    return {
      title: `Resultados para "${search}"`,
      description: `Encontrá perfumes árabes relacionados con "${search}" en ELIX.`,
      robots: { index: false },
    };
  }

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return { title: "Categoría no encontrada" };
    }

    return {
      title: category.name,
      description: category.description || `Catálogo de ${category.name} en ELIX.`,
      openGraph: {
        title: `${category.name} — ELIX`,
        description: category.description || `Catálogo de ${category.name}.`,
      },
    };
  }

  return {};
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { categoryId, search } = await searchParams;

  if (!categoryId && !search) {
    redirect("/");
  }

  const navCategories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const navbarCategories = navCategories.map((c) => ({
    label: c.name,
    href: `/products?categoryId=${c.id}`,
  }));

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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
              { "@type": "ListItem", position: 2, name: category.name },
            ],
          }}
        />
        <Navbar
          active={`/products?categoryId=${category.id}`}
          categories={navbarCategories}
        />
        <Suspense>
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
        </Suspense>
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
        <Navbar active="/" categories={navbarCategories} />
      <Suspense>
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
      </Suspense>
      <Footer />
    </>
  );
}
