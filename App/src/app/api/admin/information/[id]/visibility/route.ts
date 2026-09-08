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

  const existing = await prisma.information.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 })
  }

  const section = await prisma.information.update({
    where: { id },
    data: { visible: !existing.visible },
  })

  revalidatePath('/nosotros')

  return NextResponse.json(section)
}
