import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(brands)
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await request.json()
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const existing = await prisma.brand.findFirst({ where: { name: { equals: name.trim(), mode: 'insensitive' } } })
  if (existing) {
    return NextResponse.json({ error: 'Brand already exists' }, { status: 409 })
  }

  const brand = await prisma.brand.create({
    data: { name: name.trim() },
  })
  return NextResponse.json(brand, { status: 201 })
}
