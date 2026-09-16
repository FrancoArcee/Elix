import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";
import JsonLd from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://elixfragancias.com.ar";

type ProductFull = Prisma.ProductGetPayload<{
  include: {
    brand: true
    category: true
    images: true
    notes: { include: { note: true } }
    volumes: { include: { volume: true } }
  }
}>;

type ProductWithBrandAndImages = Prisma.ProductGetPayload<{
  include: { brand: true; images: true }
}>;

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { brand: true, images: true },
  });

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const title = `${product.brand.name} ${product.name}`;
  const description =
    product.description?.slice(0, 160) ||
    `${product.name} de ${product.brand.name} — Perfumería árabe original en ELIX.`;

  const imageUrl = product.images[0]?.imageUrl || `${baseUrl}/og-image.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  const [product, primaryContact, navCategories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        notes: { include: { note: true } },
        volumes: { include: { volume: true } },
      },
    }) as Promise<ProductFull | null>,
    prisma.contact.findFirst({
      where: { isPrimary: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: id },
      OR: [
        { concentration: product.concentration },
        { fraganceFamily: product.fraganceFamily },
      ],
    },
    include: {
      brand: true,
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
    },
    take: 4,
  }) as ProductWithBrandAndImages[];

  const allImages = product.images.map((img: { imageUrl: string }) => img.imageUrl);

  const noteGroups: Record<string, string[]> = {};
  for (const pn of product.notes) {
    const label =
      pn.type === "salida" ? "Salida" :
      pn.type === "corazon" ? "Corazón" :
      pn.type === "fondo" ? "Fondo" :
      "Nota";
    if (!noteGroups[label]) noteGroups[label] = [];
    noteGroups[label].push(pn.note.name);
  }
  const olfactoryNotes = Object.entries(noteGroups).map(([label, notes]) => ({
    label,
    notes,
  }));

  const sizes = product.volumes.map((pv: { volume: { volume: number } }) => `${pv.volume.volume}ml`);

  const concentrationLabels: Record<string, string> = {
    edt: "Eau de Toilette (EDT)",
    edp: "Eau de Parfum (EDP)",
    edc: "Eau de Cologne (EDC)",
    extrait: "Extrait de Parfum",
  };

  const navbarCategories = navCategories.map((c) => ({
    label: c.name,
    href: `/products?categoryId=${c.id}`,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${product.brand.name} ${product.name}`,
          description: product.description || `${product.name} de ${product.brand.name}`,
          image: allImages,
          brand: { "@type": "Brand", name: product.brand.name },
          category: product.category.name,
          offers: product.price
            ? {
                "@type": "Offer",
                priceCurrency: "ARS",
                price: Number(product.price),
                availability: "https://schema.org/InStock",
                url: `${baseUrl}/products/${product.id}`,
              }
            : undefined,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
              { "@type": "ListItem", position: 2, name: product.category.name, item: `${baseUrl}/products?categoryId=${product.categoryId}` },
              { "@type": "ListItem", position: 3, name: `${product.brand.name} ${product.name}` },
            ],
          },
        }}
      />
      <Navbar active={`/products?categoryId=${product.categoryId}`} withSearchBar={false} categories={navbarCategories} />
      <ProductDetail
        brand={product.brand.name}
        name={product.name}
        concentration={product.concentration}
        image={allImages[0]}
        images={allImages}
        sizes={sizes}
        defaultSize={sizes[sizes.length - 1]}
        benefits={[]}
        olfactoryNotes={olfactoryNotes}
        description={product.description ?? undefined}
        characteristics={[
          ...(product.concentration && concentrationLabels[product.concentration]
            ? [`Concentración: ${concentrationLabels[product.concentration]}`]
            : []),
          sizes.length ? `Disponible en ${sizes.join(", ")}` : null,
        ].filter(Boolean) as string[]}
        primaryContact={primaryContact ? { application: primaryContact.application, value: primaryContact.value } : null}
        related={relatedProducts.map((p) => ({
          image: p.images[0]?.imageUrl ?? null,
          brand: p.brand.name,
          name: p.name,
          badge: p.badge ?? undefined,
          surface: "surface" as const,
          href: `/products/${p.id}`,
        }))}
      />
      <Footer />
    </>
  );
}
