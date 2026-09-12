import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { brand: true; category: true; images: true }
}>

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')

  const where = categoryId ? { categoryId } : {}

  const products = await prisma.product.findMany({
    where,
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: 'asc' } },
    },
    orderBy: { name: 'asc' },
  }) as ProductWithRelations[]

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand.name,
      brandId: p.brandId,
      category: p.category.name,
      categoryId: p.categoryId,
      image: p.images[0]?.imageUrl ?? null,
      images: p.images.map((img) => img.imageUrl),
      price: p.price ? Number(p.price) : null,
      fraganceFamily: p.fraganceFamily,
      concentration: p.concentration,
      targetAudience: p.targetAudience,
      presentation: p.presentation,
      badge: p.badge,
      description: p.description,
    }))
  )
}
