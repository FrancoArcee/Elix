import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { informationSectionSchema } from '@/schemas/information'
import { validateApiRequest } from '@/lib/validation'

async function ensureHowToBuySection() {
  const existing = await prisma.information.findUnique({
    where: { id: 'how_to_buy' },
  })
  if (!existing) {
    const maxOrder = await prisma.information.aggregate({
      _max: { displayOrder: true },
    })
    const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1
    await prisma.information.create({
      data: {
        id: 'how_to_buy',
        label: 'Cómo comprar',
        title: 'Sin carritos. Sin formularios. Solo una consulta.',
        description:
          'Proceso guiado de compra directa: Explorás el catálogo, consultás desde el producto y coordinamos la entrega.',
        visible: true,
        displayOrder: nextOrder,
      },
    })
  }
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureHowToBuySection()

  const sections = await prisma.information.findMany({
    orderBy: { displayOrder: 'asc' },
  })
  return NextResponse.json(sections)
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const validation = validateApiRequest(informationSectionSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { label, title, description, imageUrl, visible, displayOrder } = validation.data

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
