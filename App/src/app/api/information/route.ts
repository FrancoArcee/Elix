import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
  await ensureHowToBuySection()

  const sections = await prisma.information.findMany({
    where: { visible: true },
    orderBy: { displayOrder: 'asc' },
  })
  return NextResponse.json(sections)
}
