import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { application, value, displayOrder } = body

  const existing = await prisma.contact.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: {
      ...(application !== undefined && { application }),
      ...(value !== undefined && { value }),
      ...(displayOrder !== undefined && { displayOrder }),
    },
  })

  return NextResponse.json(contact)
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
  return NextResponse.json({ status: 'deleted' })
}
