import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

type ProductFull = Prisma.ProductGetPayload<{
  include: {
    brand: true
    category: true
    images: true
    notes: { include: { note: true } }
    volumes: { include: { volume: true } }
  }
}>

type ProductWithBrandAndImages = Prisma.ProductGetPayload<{
  include: { brand: true; images: true }
}>

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: 'asc' } },
      notes: { include: { note: true } },
      volumes: { include: { volume: true } },
    },
  }) as ProductFull | null

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: id },
      OR: [
        { concentration: product.concentration },
        { fraganceFamily: product.fraganceFamily },
      ],
    },
    include: { brand: true, images: { orderBy: { displayOrder: 'asc' } } },
    take: 4,
  }) as ProductWithBrandAndImages[]

  return NextResponse.json({
    id: product.id,
    name: product.name,
    brand: product.brand.name,
    brandId: product.brandId,
    category: product.category.name,
    categoryId: product.categoryId,
    image: product.images[0]?.imageUrl ?? null,
    images: product.images.map((img) => img.imageUrl),
    price: product.price ? Number(product.price) : null,
    originalPrice: null,
    fraganceFamily: product.fraganceFamily,
    concentration: product.concentration,
    targetAudience: product.targetAudience,
    presentation: product.presentation,
    description: product.description,
    badge: product.badge,
    olfactoryNotes: product.notes.map((pn) => ({
      type: pn.type,
      name: pn.note.name,
    })),
    volumes: product.volumes.map((pv) => ({
      id: pv.volume.id,
      volume: pv.volume.volume,
    })),
    related: relatedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand.name,
      image: p.images[0]?.imageUrl ?? null,
    })),
  })
}
