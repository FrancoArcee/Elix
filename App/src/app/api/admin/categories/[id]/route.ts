import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { intToHex, hexToInt } from '@/lib/colors'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { name, color, urlImage, description } = body

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
  return NextResponse.json({ status: 'deleted' })
}
