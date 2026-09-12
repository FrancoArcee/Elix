import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

export async function PUT(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { orderedIds } = body as { orderedIds?: string[] }

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 })
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.information.update({
        where: { id },
        data: { displayOrder: index },
      })
    )
  )

  revalidatePath('/nosotros')

  const sections = await prisma.information.findMany({
    orderBy: { displayOrder: 'asc' },
  })

  return NextResponse.json(sections)
}
