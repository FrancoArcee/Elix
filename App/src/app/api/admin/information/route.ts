import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sections = await prisma.information.findMany({
    orderBy: { displayOrder: 'asc' },
  })
  return NextResponse.json(sections)
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { label, title, description, imageUrl, visible, displayOrder } = body

  if (!label || !title || !description) {
    return NextResponse.json({ error: 'label, title and description are required' }, { status: 400 })
  }

  const maxOrder = await prisma.information.aggregate({ _max: { displayOrder: true } })
  const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1

  const section = await prisma.information.create({
    data: {
      label,
      title,
      description,
      imageUrl: imageUrl || null,
      visible: visible ?? true,
      displayOrder: displayOrder ?? nextOrder,
    },
  })

  revalidatePath('/nosotros')

  return NextResponse.json(section, { status: 201 })
}
