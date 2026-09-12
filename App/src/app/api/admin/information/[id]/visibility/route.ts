import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  if (id === 'how_to_buy') {
    return NextResponse.json({ error: 'System section visibility cannot be changed' }, { status: 403 })
  }

  const existing = await prisma.information.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 })
  }

  const newVisible = !existing.visible

  const allSections = await prisma.information.findMany({
    orderBy: { displayOrder: 'asc' },
  })

  let newOrderList: { id: string; visible: boolean }[] = []

  if (!newVisible) {
    const visibleOthers = allSections.filter((s) => s.id !== id && s.visible)
    const hiddenOthers = allSections.filter((s) => s.id !== id && !s.visible)
    newOrderList = [
      ...visibleOthers.map((s) => ({ id: s.id, visible: true })),
      ...hiddenOthers.map((s) => ({ id: s.id, visible: false })),
      { id, visible: false },
    ]
  } else {
    const visibleOthers = allSections.filter((s) => s.id !== id && s.visible)
    const hiddenOthers = allSections.filter((s) => s.id !== id && !s.visible)
    newOrderList = [
      ...visibleOthers.map((s) => ({ id: s.id, visible: true })),
      { id, visible: true },
      ...hiddenOthers.map((s) => ({ id: s.id, visible: false })),
    ]
  }

  await prisma.$transaction(
    newOrderList.map((item, index) =>
      prisma.information.update({
        where: { id: item.id },
        data: {
          visible: item.visible,
          displayOrder: index,
        },
      })
    )
  )

  revalidatePath('/nosotros')

  const updated = await prisma.information.findUnique({ where: { id } })
  return NextResponse.json(updated)
}
