import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const hero = await prisma.hero.findFirst()
  if (!hero) {
    return NextResponse.json({ error: 'Hero not found' }, { status: 404 })
  }
  return NextResponse.json(hero)
}
