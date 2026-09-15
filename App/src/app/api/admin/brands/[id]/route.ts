import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { brandSchema } from '@/schemas/brand'
import { validateApiRequest } from '@/lib/validation'

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

  const existing = await prisma.brand.findUnique({ where: { id }, include: { _count: { select: { products: true } } } })
  if (!existing) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }
  if (existing._count.products > 0) {
    return NextResponse.json({ error: 'Cannot delete brand with associated products' }, { status: 409 })
  }

  await prisma.brand.delete({ where: { id } })
  return NextResponse.json({ status: 'deleted' })
}
