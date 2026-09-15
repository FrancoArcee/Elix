import { fetchAdmin } from '@/lib/fetch-admin'

export interface ProductImageData {
  url: string
  key?: string
  displayOrder?: number
}

export interface ProductData {
  id: string
  name: string
  brand: string
  brandId: string
  category: string
  categoryId: string
  image: string | null
  images: ProductImageData[] | string[]
  price: number | null
  originalPrice?: number | null
  fraganceFamily: string | null
  concentration: string | null
  targetAudience: string
  presentation: string | null
  description: string | null
  badge?: string | null
}

export interface ProductDetailData extends ProductData {
  olfactoryNotes: { type: string; name: string }[]
  volumes: { id: string; volume: number }[]
  related: { id: string; name: string; brand: string; image: string | null }[]
}

export async function getProducts(categoryId?: string): Promise<ProductData[]> {
  const url = categoryId ? `/api/products?categoryId=${categoryId}` : '/api/products'
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function searchProducts(query: string): Promise<ProductData[]> {
  const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getProduct(id: string): Promise<ProductDetailData | null> {
  const res = await fetch(`/api/products/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export async function getAdminProducts(): Promise<ProductData[]> {
  const res = await fetchAdmin('/api/admin/products', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function createProduct(data: {
  name: string
  brandId: string
  categoryId: string
  targetAudience: string
  description?: string
  price?: number
  fraganceFamily?: string
  presentation?: string
  concentration?: string
  badge?: string
  images?: { url: string }[]
  notes?: { noteName: string; type: string }[]
}): Promise<ProductData> {
  const res = await fetchAdmin('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(id: string, data: {
  name: string
  brandId: string
  categoryId: string
  targetAudience: string
  description?: string
  price?: number
  fraganceFamily?: string
  presentation?: string
  concentration?: string
  badge?: string
  images?: { url: string }[]
  notes?: { noteName: string; type: string }[]
}): Promise<ProductData> {
  const res = await fetchAdmin(`/api/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update product')
  return res.json()
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetchAdmin(`/api/admin/products/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete product')
}
