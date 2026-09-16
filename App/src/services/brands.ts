import { fetchAdmin } from '@/lib/fetch-admin'

export interface BrandData {
  id: string
  name: string
}

export async function getAdminBrands(): Promise<BrandData[]> {
  const res = await fetchAdmin('/api/admin/brands', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function createBrand(data: { name: string }): Promise<BrandData> {
  const res = await fetchAdmin('/api/admin/brands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create brand')
  return res.json()
}
