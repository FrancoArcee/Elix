import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'Admin create product — implement with Prisma + JWT auth' })
}

export async function GET() {
  return NextResponse.json({ message: 'Admin list products — implement with Prisma + JWT auth' })
}
