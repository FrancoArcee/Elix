import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

import { contactSchema } from '@/schemas/contact'
import { validateApiRequest } from '@/lib/validation'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contacts = await prisma.contact.findMany({
    orderBy: { displayOrder: 'asc' },
  })
  return NextResponse.json(contacts)
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const validation = validateApiRequest(contactSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { application, value, isPrimary, displayOrder } = validation.data

  if (isPrimary) {
    await prisma.contact.updateMany({
      where: { isPrimary: true },
      data: { isPrimary: false },
    })
  }

  const maxOrder = await prisma.contact.aggregate({ _max: { displayOrder: true } })
  const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1

  try {
    const contact = await prisma.contact.create({
      data: {
        application,
        value,
        isPrimary: isPrimary ?? false,
        displayOrder: displayOrder ?? nextOrder,
      },
    })
    return NextResponse.json(contact, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: `Ya existe un contacto para "${application}"` }, { status: 409 })
    }
    throw e
  }
}
