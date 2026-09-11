import { fetchAdmin } from '@/lib/fetch-admin'

export interface BrandData {
  id: string
  name: string
}

export async function getBrands(): Promise<BrandData[]> {
  const res = await fetch('/api/brands', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
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

export async function updateBrand(id: string, data: { name: string }): Promise<BrandData> {
  const res = await fetchAdmin(`/api/admin/brands/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update brand')
  return res.json()
}

export async function deleteBrand(id: string): Promise<void> {
  const res = await fetchAdmin(`/api/admin/brands/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete brand')
}
