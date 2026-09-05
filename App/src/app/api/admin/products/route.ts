import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'

export async function POST() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({ message: 'Admin create product — implement with Prisma' })
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({ message: 'Admin list products — implement with Prisma' })
}
