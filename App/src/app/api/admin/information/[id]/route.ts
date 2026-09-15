import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { informationSectionUpdateSchema } from '@/schemas/information'
import { validateApiRequest } from '@/lib/validation'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  if (id === 'how_to_buy') {
    return NextResponse.json({ error: 'System section content cannot be modified' }, { status: 403 })
  }

  const body = await request.json()
  const validation = validateApiRequest(informationSectionUpdateSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { label, title, description, imageUrl, visible, displayOrder } = validation.data

  const existing = await prisma.information.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 })
  }

  const section = await prisma.information.update({
    where: { id },
    data: {
      ...(label !== undefined && { label }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      ...(visible !== undefined && { visible }),
      ...(displayOrder !== undefined && { displayOrder }),
    },
  })

  revalidatePath('/nosotros')

  return NextResponse.json(section)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  if (id === 'how_to_buy') {
    return NextResponse.json({ error: 'System section cannot be deleted' }, { status: 403 })
  }

  const existing = await prisma.information.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 })
  }

  await prisma.information.delete({ where: { id } })

  revalidatePath('/nosotros')

  return NextResponse.json({ status: 'deleted' })
}
