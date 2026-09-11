import { fetchAdmin } from '@/lib/fetch-admin'

export type FeaturedProductData = {
  id: string
  productId: string
  displayOrder: number
  product: {
    id: string
    name: string
    brand: string
    image: string | null
  }
}

export async function getFeatured(): Promise<FeaturedProductData[]> {
  const res = await fetch('/api/featured', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getAdminFeatured(): Promise<FeaturedProductData[]> {
  const res = await fetchAdmin('/api/admin/featured', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function addFeatured(productId: string): Promise<FeaturedProductData> {
  const res = await fetchAdmin('/api/admin/featured', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  })
  if (!res.ok) throw new Error('Failed to add featured product')
  return res.json()
}

export async function reorderFeatured(orderedIds: string[]): Promise<void> {
  const res = await fetchAdmin('/api/admin/featured', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  })
  if (!res.ok) throw new Error('Failed to reorder featured products')
}

export async function removeFeatured(productId: string): Promise<void> {
  const res = await fetchAdmin('/api/admin/featured', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  })
  if (!res.ok) throw new Error('Failed to remove featured product')
}
