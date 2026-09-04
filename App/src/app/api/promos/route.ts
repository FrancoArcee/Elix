import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Promos endpoint — implement with Prisma models' })
}
