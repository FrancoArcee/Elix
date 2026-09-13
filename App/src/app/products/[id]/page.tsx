import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";

export const dynamic = "force-dynamic";

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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
      notes: { include: { note: true } },
      volumes: { include: { volume: true } },
    },
  }) as ProductFull | null;

  if (!product) notFound();

  const primaryContact = await prisma.contact.findFirst({
    where: { isPrimary: true },
  });

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: id } },
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

  return (
    <>
      <Navbar active={`/products?categoryId=${product.categoryId}`} withSearchBar={false} />
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
