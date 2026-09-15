import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { paymentMethodUpdateSchema } from '@/schemas/payment-method'
import { validateApiRequest } from '@/lib/validation'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const validation = validateApiRequest(paymentMethodUpdateSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { method, identifier } = validation.data

  const existing = await prisma.paymentMethod.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Payment method not found' }, { status: 404 })
  }

  const paymentMethod = await prisma.paymentMethod.update({
    where: { id },
    data: {
      ...(method !== undefined && { method }),
      ...(identifier !== undefined && { identifier: identifier || null }),
    },
  })

  return NextResponse.json(paymentMethod)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.paymentMethod.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Payment method not found' }, { status: 404 })
  }

  await prisma.paymentMethod.delete({ where: { id } })
  return NextResponse.json({ status: 'deleted' })
}
