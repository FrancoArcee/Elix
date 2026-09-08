import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sections = await prisma.information.findMany({
    where: { visible: true },
    orderBy: { displayOrder: 'asc' },
  })
  return NextResponse.json(sections)
}
