import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { revalidatePublicData } from '@/lib/public-data'
import { intToHex, hexToInt } from '@/lib/colors'

import { categorySchema } from '@/schemas/category'
import { validateApiRequest } from '@/lib/validation'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(
    categories.map((c) => ({
      id: c.id,
      name: c.name,
      color: intToHex(c.color),
      urlImage: c.urlImage,
      description: c.description,
    }))
  )
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const validation = validateApiRequest(categorySchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { name, color, urlImage, description } = validation.data

  const category = await prisma.category.create({
    data: {
      name,
      color: hexToInt(color),
      urlImage: urlImage || null,
      description,
    },
  })

  revalidatePublicData('public-categories', 'public-offer')

  return NextResponse.json({
    id: category.id,
    name: category.name,
    color: intToHex(category.color),
    urlImage: category.urlImage,
    description: category.description,
  }, { status: 201 })
}
