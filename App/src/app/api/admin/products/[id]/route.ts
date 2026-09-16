import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { revalidatePublicData } from '@/lib/public-data'
import { deleteImage } from '@/lib/r2'
import { productApiSchema } from '@/schemas/product'
import { validateApiRequest } from '@/lib/validation'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

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

  if (images && Array.isArray(images)) {
    const oldImages = await prisma.productImage.findMany({ where: { productId: id } })
    const oldUrls = new Set(oldImages.map((img: { imageUrl: string }) => img.imageUrl))
    const newUrls = new Set(images.map((img: { url: string }) => img.url))

    for (const oldUrl of oldUrls) {
      if (!newUrls.has(oldUrl) && oldUrl.includes('r2.dev')) {
        const key = oldUrl.split('/').slice(-2).join('/')
        try { await deleteImage(key) } catch {}
      }
    }

    await prisma.productImage.deleteMany({ where: { productId: id } })
  }

  const product = await prisma.product.update({
    where: { id },
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
      ...(images && Array.isArray(images) && {
        images: {
          create: images.map((img: { url: string }, i: number) => ({
            imageUrl: img.url,
            displayOrder: i,
          })),
        },
      }),
    },
    include: { brand: true, category: true, images: { orderBy: { displayOrder: 'asc' } } },
  })

  if (notes && Array.isArray(notes)) {
    await prisma.productNote.deleteMany({ where: { productId: id } })
    for (const n of notes as { noteName: string; type: string }[]) {
      let note = await prisma.note.findFirst({ where: { name: n.noteName } })
      if (!note) note = await prisma.note.create({ data: { name: n.noteName } })
      await prisma.productNote.create({
        data: { productId: id, noteId: note.id, type: n.type as 'salida' | 'corazon' | 'fondo' | 'unico' },
      })
    }
  }

  if (presentation !== undefined) {
    await prisma.productVolume.deleteMany({ where: { productId: id } })
    if (presentation && typeof presentation === 'string') {
      const mlValues = presentation.split(',').map((s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10)).filter((n: number) => n > 0 && !isNaN(n))
      for (const ml of mlValues) {
        const volume = await prisma.volume.upsert({ where: { volume: ml }, create: { volume: ml }, update: {} })
        await prisma.productVolume.create({ data: { productId: id, volumeId: volume.id } })
      }
    }
  }

  revalidatePublicData('public-featured')

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
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.product.findUnique({ where: { id }, include: { images: true } })
  if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  for (const img of existing.images) {
    if (img.imageUrl.includes('r2.dev')) {
      const key = img.imageUrl.split('/').slice(-2).join('/')
      try { await deleteImage(key) } catch {}
    }
  }

  await prisma.productNote.deleteMany({ where: { productId: id } })
  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.featuredProduct.deleteMany({ where: { productId: id } })
  await prisma.productVolume.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })
  revalidatePublicData('public-featured')

  return NextResponse.json({ status: 'deleted' })
}
