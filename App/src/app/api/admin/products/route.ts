import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { productApiSchema } from '@/schemas/product'
import { validateApiRequest } from '@/lib/validation'

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { brand: true; category: true; images: true }
}>

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const products = await prisma.product.findMany({
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
      images: p.images.map((img) => ({ url: img.imageUrl, key: img.imageUrl.split('/').pop(), displayOrder: img.displayOrder })),
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

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const validation = validateApiRequest(productApiSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { name, brandId, categoryId, targetAudience, description, price, fraganceFamily, presentation, concentration, badge, images, notes } = validation.data

  const [brand, category] = await Promise.all([
    prisma.brand.findUnique({ where: { id: brandId } }),
    prisma.category.findUnique({ where: { id: categoryId } }),
  ])
  if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

  const product = await prisma.product.create({
    data: {
      name,
      brandId,
      categoryId,
      targetAudience,
      description: description || null,
      price: price ? Number(price) : null,
      fraganceFamily: fraganceFamily || null,
      presentation: presentation || null,
      concentration: concentration || null,
      badge: badge || null,
      images: {
        create: (images ?? []).map((img: { url: string }, i: number) => ({
          imageUrl: img.url,
          displayOrder: i,
        })),
      },
    },
    include: { brand: true, category: true, images: { orderBy: { displayOrder: 'asc' } } },
  })

  if (notes && Array.isArray(notes)) {
    for (const n of notes as { noteName: string; type: string }[]) {
      let note = await prisma.note.findFirst({ where: { name: n.noteName } })
      if (!note) note = await prisma.note.create({ data: { name: n.noteName } })
      await prisma.productNote.create({
        data: { productId: product.id, noteId: note.id, type: n.type as 'salida' | 'corazon' | 'fondo' | 'unico' },
      })
    }
  }

  if (presentation && typeof presentation === 'string') {
    const mlValues = presentation.split(',').map((s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10)).filter((n: number) => n > 0 && !isNaN(n))
    for (const ml of mlValues) {
      const volume = await prisma.volume.upsert({ where: { volume: ml }, create: { volume: ml }, update: {} })
      await prisma.productVolume.upsert({ where: { productId_volumeId: { productId: product.id, volumeId: volume.id } }, create: { productId: product.id, volumeId: volume.id }, update: {} })
    }
  }

  return NextResponse.json({
    id: product.id,
    name: product.name,
    brand: product.brand.name,
    brandId: product.brandId,
    category: product.category.name,
    categoryId: product.categoryId,
    image: product.images[0]?.imageUrl ?? null,
    images: product.images.map((img: { imageUrl: string; displayOrder: number }) => ({ url: img.imageUrl, displayOrder: img.displayOrder })),
    price: product.price ? Number(product.price) : null,
    fraganceFamily: product.fraganceFamily,
    concentration: product.concentration,
    targetAudience: product.targetAudience,
    presentation: product.presentation,
    badge: product.badge,
    description: product.description,
  }, { status: 201 })
}
