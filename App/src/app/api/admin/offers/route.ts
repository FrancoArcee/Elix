import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { revalidatePublicData } from '@/lib/public-data'
import { offerApiSchema } from '@/schemas/offer'
import { validateApiRequest } from '@/lib/validation'

type OfferWithRelations = {
  id: string
  discount: { toString(): string } | null
  description: string | null
  active: boolean
  offerCategories: { category: { name: string } }[]
  offerPaymentMethods: { paymentMethod: { method: string } }[]
}

function flattenOffer(offer: OfferWithRelations, allCategoryCount: number) {
  const categoryNames = offer.offerCategories.map((oc) => oc.category.name)
  const isAllCategories = categoryNames.length === allCategoryCount && allCategoryCount > 0
  return {
    id: offer.id,
    discount: Number(offer.discount),
    paymentMethod: offer.offerPaymentMethods[0]?.paymentMethod.method ?? '',
    categories: isAllCategories ? ['Toda la colección'] : categoryNames,
    description: offer.description ?? '',
    active: offer.active,
  }
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [offers, allCategoryCount] = await Promise.all([
    prisma.offer.findMany({
      include: {
        offerCategories: { include: { category: true } },
        offerPaymentMethods: { include: { paymentMethod: true } },
      },
      orderBy: { active: 'desc' },
    }),
    prisma.category.count(),
  ])

  return NextResponse.json((offers as unknown as OfferWithRelations[]).map((o) => flattenOffer(o, allCategoryCount)))
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const validation = validateApiRequest(offerApiSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { discount, description, paymentMethod, categories, active } = validation.data

  if (active) {
    await prisma.offer.updateMany({
      where: { active: true },
      data: { active: false },
    })
  }

  const allCategories = await prisma.category.findMany()
  const isAllCategories = categories?.includes('Toda la colección')
  const categoryIds = isAllCategories
    ? allCategories.map((c: { id: string }) => c.id)
    : allCategories.filter((c: { name: string }) => categories?.includes(c.name)).map((c: { id: string }) => c.id)

  let paymentMethodRecord = paymentMethod
    ? await prisma.paymentMethod.findFirst({ where: { method: paymentMethod } })
    : null
  if (!paymentMethodRecord && paymentMethod) {
    paymentMethodRecord = await prisma.paymentMethod.create({
      data: { method: paymentMethod },
    })
  }

  const offer = await prisma.offer.create({
    data: {
      discount: Number(discount),
      description: description || null,
      active: active ?? false,
      offerPaymentMethods: paymentMethodRecord
        ? { create: [{ paymentMethodId: paymentMethodRecord.id }] }
        : undefined,
      offerCategories: categoryIds.length > 0
        ? { create: categoryIds.map((categoryId: string) => ({ categoryId })) }
        : undefined,
    },
    include: {
      offerCategories: { include: { category: true } },
      offerPaymentMethods: { include: { paymentMethod: true } },
    },
  })

  revalidatePublicData('public-offer')

  return NextResponse.json(flattenOffer(offer, allCategories.length), { status: 201 })
}
