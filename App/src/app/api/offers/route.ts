import { NextResponse } from 'next/server'
import { getPublicActiveOffers } from '@/lib/public-data'

export async function GET() {
  const offers = await getPublicActiveOffers()
  return NextResponse.json(offers)
}