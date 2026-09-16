import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { revalidatePublicData } from '@/lib/public-data'
import { contactUpdateSchema } from '@/schemas/contact'
import { validateApiRequest } from '@/lib/validation'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const validation = validateApiRequest(contactUpdateSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { application, value, isPrimary, displayOrder } = validation.data

  const existing = await prisma.contact.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
  }

  if (isPrimary) {
    await prisma.contact.updateMany({
      where: { isPrimary: true, id: { not: id } },
      data: { isPrimary: false },
    })
  }

  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(application !== undefined && { application }),
        ...(value !== undefined && { value }),
        ...(isPrimary !== undefined && { isPrimary }),
        ...(displayOrder !== undefined && { displayOrder }),
      },
    })

    revalidatePublicData('public-contacts')

    return NextResponse.json(contact)
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: `Ya existe un contacto para "${application}"` }, { status: 409 })
    }
    throw e
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.contact.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
  }

  await prisma.contact.delete({ where: { id } })
  revalidatePublicData('public-contacts')
  return NextResponse.json({ status: 'deleted' })
}
