import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'
import { heroSchema } from '@/schemas/information'
import { validateApiRequest } from '@/lib/validation'

export async function PUT(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const validation = validateApiRequest(heroSchema, body)
  if (!validation.success) {
    return validation.response
  }

  const { kicker, title, imageUrl } = validation.data

  const existing = await prisma.hero.findFirst()

  let hero
  if (existing) {
    hero = await prisma.hero.update({
      where: { id: existing.id },
      data: { kicker, title, imageUrl },
    })
  } else {
    hero = await prisma.hero.create({
      data: { kicker, title, imageUrl },
    })
  }

  revalidatePath('/')

  return NextResponse.json(hero)
}
