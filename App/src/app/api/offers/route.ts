import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const offer = await prisma.offer.findFirst({
    where: { active: true },
    include: {
      offerCategories: { include: { category: true } },
      offerPaymentMethods: { include: { paymentMethod: true } },
    },
  })

  if (!offer) {
    return NextResponse.json(null)
  }

  const allCategories = await prisma.category.count()
  const offerCategoryNames = offer.offerCategories.map((oc: { category: { name: string } }) => oc.category.name)
  const isAllCategories = offerCategoryNames.length === allCategories && allCategories > 0

  return NextResponse.json({
    id: offer.id,
    discount: Number(offer.discount),
    paymentMethod: offer.offerPaymentMethods[0]?.paymentMethod.method ?? '',
    categories: isAllCategories ? ['Toda la colección'] : offerCategoryNames,
    description: offer.description ?? '',
    active: offer.active,
  })
}
