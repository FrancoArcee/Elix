import { fetchAdmin } from '@/lib/fetch-admin'

export interface CategoryData {
  id: string
  name: string
  color: string
  urlImage: string | null
  description: string
}

export async function getCategories(): Promise<CategoryData[]> {
  const res = await fetch('/api/categories', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getAdminCategories(): Promise<CategoryData[]> {
  const res = await fetchAdmin('/api/admin/categories', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function createCategory(
  data: Omit<CategoryData, 'id'>
): Promise<CategoryData> {
  const res = await fetchAdmin('/api/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create category')
  return res.json()
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<CategoryData, 'id'>>
): Promise<CategoryData> {
  const res = await fetchAdmin(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update category')
  return res.json()
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetchAdmin(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete category')
}
