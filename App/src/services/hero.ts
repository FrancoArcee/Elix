import { fetchAdmin } from '@/lib/fetch-admin'

export interface HeroData {
  id: string
  kicker: string
  title: string
  imageUrl: string
}

export async function getHero(): Promise<HeroData | null> {
  const res = await fetch(`/api/hero`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export async function updateHero(data: Omit<HeroData, 'id'>): Promise<HeroData> {
  const res = await fetchAdmin(`/api/admin/hero`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update hero')
  return res.json()
}
