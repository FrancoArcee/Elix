import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { intToHex, hexToInt } from '@/lib/colors'

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
  const { name, color, urlImage, description } = body

  if (!name || !color || !description) {
    return NextResponse.json({ error: 'name, color and description are required' }, { status: 400 })
  }

  const category = await prisma.category.create({
    data: {
      name,
      color: hexToInt(color),
      urlImage: urlImage || null,
      description,
    },
  })

  return NextResponse.json({
    id: category.id,
    name: category.name,
    color: intToHex(category.color),
    urlImage: category.urlImage,
    description: category.description,
  }, { status: 201 })
}
