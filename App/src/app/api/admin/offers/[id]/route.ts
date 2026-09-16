import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { offerApiUpdateSchema } from '@/schemas/offer'
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      offerCategories: { include: { category: true } },
      offerPaymentMethods: { include: { paymentMethod: true } },
    },
  })

  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  const allCategoryCount = await prisma.category.count()
  return NextResponse.json(flattenOffer(offer as unknown as OfferWithRelations, allCategoryCount))
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.offer.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  const body = await request.json()
  const validation = validateApiRequest(offerApiUpdateSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { discount, description, paymentMethod, categories, active } = validation.data

  if (active && !existing.active) {
    await prisma.offer.updateMany({
      where: { active: true, id: { not: id } },
      data: { active: false },
    })
  }

  let paymentMethodRecord = null
  if (paymentMethod !== undefined) {
    paymentMethodRecord = await prisma.paymentMethod.findFirst({ where: { method: paymentMethod } })
    if (!paymentMethodRecord && paymentMethod) {
      paymentMethodRecord = await prisma.paymentMethod.create({
        data: { method: paymentMethod },
      })
    }
    await prisma.offerPaymentMethod.deleteMany({ where: { offerId: id } })
  }

  let categoryIds: string[] = []
  if (categories !== undefined) {
    const allCategories = await prisma.category.findMany()
    const isAllCategories = categories.includes('Toda la colección')
    categoryIds = isAllCategories
      ? allCategories.map((c: { id: string }) => c.id)
      : allCategories.filter((c: { name: string }) => categories.includes(c.name)).map((c: { id: string }) => c.id)

    await prisma.offerCategory.deleteMany({ where: { offerId: id } })
  }

  const offer = await prisma.offer.update({
    where: { id },
    data: {
      ...(discount !== undefined && { discount: Number(discount) }),
      ...(description !== undefined && { description: description || null }),
      ...(active !== undefined && { active }),
      ...(paymentMethod !== undefined && paymentMethodRecord && {
        offerPaymentMethods: { create: [{ paymentMethodId: paymentMethodRecord.id }] },
      }),
      ...(categories !== undefined && categoryIds.length > 0 && {
        offerCategories: { create: categoryIds.map((categoryId: string) => ({ categoryId })) },
      }),
    },
    include: {
      offerCategories: { include: { category: true } },
      offerPaymentMethods: { include: { paymentMethod: true } },
    },
  })

  const allCategoryCount = await prisma.category.count()
  return NextResponse.json(flattenOffer(offer as unknown as OfferWithRelations, allCategoryCount))
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.offer.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  await prisma.offerPaymentMethod.deleteMany({ where: { offerId: id } })
  await prisma.offerCategory.deleteMany({ where: { offerId: id } })
  await prisma.offer.delete({ where: { id } })

  return NextResponse.json({ status: 'deleted' })
}
