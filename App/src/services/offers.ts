import { fetchAdmin } from '@/lib/fetch-admin'

export interface OfferData {
  id: string
  discount: number
  paymentMethod: string
  categories: string[]
  description: string
  active: boolean
}

export async function getAdminOffers(): Promise<OfferData[]> {
  const res = await fetchAdmin('/api/admin/offers', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function createOffer(data: {
  discount: number
  paymentMethod: string
  categories: string[]
  description: string
  active?: boolean
}): Promise<OfferData> {
  const res = await fetchAdmin('/api/admin/offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.error || 'Failed to create offer')
  }
  return res.json()
}

export async function updateOffer(
  id: string,
  data: {
    discount?: number
    paymentMethod?: string
    categories?: string[]
    description?: string
    active?: boolean
  }
): Promise<OfferData> {
  const res = await fetchAdmin(`/api/admin/offers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.error || 'Failed to update offer')
  }
  return res.json()
}

export async function deleteOffer(id: string): Promise<void> {
  const res = await fetchAdmin(`/api/admin/offers/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.error || 'Failed to delete offer')
  }
}
