import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { intToHex } from '@/lib/colors'

export async function GET() {
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
