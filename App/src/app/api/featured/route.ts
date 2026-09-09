import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const featured = await prisma.featuredProduct.findMany({
    orderBy: { displayOrder: 'asc' },
    take: 6,
    include: {
      product: {
        include: {
          brand: true,
          images: { orderBy: { displayOrder: 'asc' }, take: 1 },
        },
      },
    },
  })

  return NextResponse.json(
    featured.map((fp) => ({
      id: fp.id,
      productId: fp.productId,
      displayOrder: fp.displayOrder,
      product: {
        id: fp.product.id,
        name: fp.product.name,
        brand: fp.product.brand.name,
        image: fp.product.images[0]?.imageUrl ?? null,
      },
    }))
  )
}
