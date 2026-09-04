import { NextResponse } from 'next/server'

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({ message: `Admin update promo ${id} — implement with Prisma + JWT auth` })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({ message: `Admin delete promo ${id} — implement with Prisma + JWT auth` })
}
