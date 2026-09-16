import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { revalidatePublicData } from '@/lib/public-data'
import { intToHex, hexToInt } from '@/lib/colors'
import { categoryUpdateSchema } from '@/schemas/category'
import { validateApiRequest } from '@/lib/validation'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const validation = validateApiRequest(categoryUpdateSchema, body)
  if (!validation.success) {
    return validation.response
  }
  const { name, color, urlImage, description } = validation.data

  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(color !== undefined && { color: hexToInt(color) }),
      ...(urlImage !== undefined && { urlImage: urlImage || null }),
      ...(description !== undefined && { description }),
    },
  })

  revalidatePublicData('public-categories', 'public-offer')

  return NextResponse.json({
    id: category.id,
    name: category.name,
    color: intToHex(category.color),
    urlImage: category.urlImage,
    description: category.description,
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  await prisma.category.delete({ where: { id } })
  revalidatePublicData('public-categories', 'public-offer')
  return NextResponse.json({ status: 'deleted' })
}
