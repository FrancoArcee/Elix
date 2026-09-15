import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

import { paymentMethodSchema } from '@/schemas/payment-method'
import { validateApiRequest } from '@/lib/validation'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const methods = await prisma.paymentMethod.findMany()
  return NextResponse.json(methods)
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const validation = validateApiRequest(paymentMethodSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { method, identifier } = validation.data

  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      method,
      identifier: identifier || null,
    },
  })

  return NextResponse.json(paymentMethod, { status: 201 })
}
