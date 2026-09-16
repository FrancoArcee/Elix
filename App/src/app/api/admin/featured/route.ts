import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { revalidatePublicData } from '@/lib/public-data'

const MAX_FEATURED = 6

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const featured = await prisma.featuredProduct.findMany({
    orderBy: { displayOrder: 'asc' },
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

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId } = await request.json()
  if (!productId) return NextResponse.json({ error: 'productId is required' }, { status: 400 })

  const count = await prisma.featuredProduct.count()
  if (count >= MAX_FEATURED) {
    return NextResponse.json({ error: `Maximum ${MAX_FEATURED} featured products` }, { status: 400 })
  }

  const existing = await prisma.featuredProduct.findUnique({ where: { productId } })
  if (existing) {
    return NextResponse.json({ error: 'Product is already featured' }, { status: 400 })
  }

  const product = await prisma.product.findUnique({ where: { id: productId }, include: { brand: true, images: { orderBy: { displayOrder: 'asc' }, take: 1 } } })
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const featured = await prisma.featuredProduct.create({
    data: { productId, displayOrder: count },
    include: {
      product: {
        include: {
          brand: true,
          images: { orderBy: { displayOrder: 'asc' }, take: 1 },
        },
      },
    },
  })

  revalidatePublicData('public-featured')

  return NextResponse.json({
    id: featured.id,
    productId: featured.productId,
    displayOrder: featured.displayOrder,
    product: {
      id: featured.product.id,
      name: featured.product.name,
      brand: featured.product.brand.name,
      image: featured.product.images[0]?.imageUrl ?? null,
    },
  }, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderedIds } = await request.json()
  if (!Array.isArray(orderedIds) || orderedIds.length > MAX_FEATURED) {
    return NextResponse.json({ error: `orderedIds must be an array of up to ${MAX_FEATURED} IDs` }, { status: 400 })
  }

  await prisma.$transaction(
    orderedIds.map((id: string, i: number) =>
      prisma.featuredProduct.update({ where: { id }, data: { displayOrder: i } })
    )
  )

  revalidatePublicData('public-featured')

  return NextResponse.json({ status: 'ok' })
}

export async function DELETE(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId } = await request.json()
  if (!productId) return NextResponse.json({ error: 'productId is required' }, { status: 400 })

  await prisma.featuredProduct.deleteMany({ where: { productId } })

  revalidatePublicData('public-featured')

  return NextResponse.json({ status: 'deleted' })
}
