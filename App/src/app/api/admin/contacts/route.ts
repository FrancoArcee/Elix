import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

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
  const { application, value, displayOrder } = body

  if (!application || !value) {
    return NextResponse.json({ error: 'application and value are required' }, { status: 400 })
  }

  const maxOrder = await prisma.contact.aggregate({ _max: { displayOrder: true } })
  const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1

  const contact = await prisma.contact.create({
    data: {
      application,
      value,
      displayOrder: displayOrder ?? nextOrder,
    },
  })

  return NextResponse.json(contact, { status: 201 })
}
