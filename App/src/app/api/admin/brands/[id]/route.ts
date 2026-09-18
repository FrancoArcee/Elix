import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { revalidatePublicData } from '@/lib/public-data'
import { brandSchema } from '@/schemas/brand'
import { validateApiRequest } from '@/lib/validation'
import { deleteProductImagesFromR2, deleteProductCascade } from '@/lib/product-cascade'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const validation = validateApiRequest(brandSchema, body)
  if (!validation.success) {
    return validation.response
  }
  const { name } = validation.data

  const existing = await prisma.brand.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const duplicate = await prisma.brand.findFirst({
    where: { name: { equals: name.trim(), mode: 'insensitive' }, id: { not: id } },
  })
  if (duplicate) {
    return NextResponse.json({ error: 'Brand already exists' }, { status: 409 })
  }

  const brand = await prisma.brand.update({
    where: { id },
    data: { name: name.trim() },
  })
  return NextResponse.json(brand)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.brand.findUnique({
    where: { id },
    include: { products: { include: { images: true } } },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  for (const product of existing.products) {
    await deleteProductImagesFromR2(product)
  }

  await prisma.$transaction(async (tx) => {
    for (const product of existing.products) {
      await deleteProductCascade(tx, product.id)
    }
    await tx.brand.delete({ where: { id } })
  })

  revalidatePublicData('public-featured', 'public-categories', 'public-offer')

  return NextResponse.json({ status: 'deleted' })
}
