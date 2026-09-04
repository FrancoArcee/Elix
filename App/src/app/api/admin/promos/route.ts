import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'Admin create promo — implement with Prisma + JWT auth' })
}

export async function GET() {
  return NextResponse.json({ message: 'Admin list promos — implement with Prisma + JWT auth' })
}
