import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  return NextResponse.json({ message: `Admin update product ${id} — implement with Prisma` })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  return NextResponse.json({ message: `Admin delete product ${id} — implement with Prisma` })
}
