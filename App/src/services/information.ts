import { fetchAdmin } from '@/lib/fetch-admin'

export interface InformationSection {
  id: string
  label: string
  title: string
  description: string
  imageUrl: string | null
  visible: boolean
  displayOrder: number
}

export async function getAdminInformation(): Promise<InformationSection[]> {
  const res = await fetchAdmin(`/api/admin/information`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function createInformation(
  data: Omit<InformationSection, 'id' | 'displayOrder'> & { displayOrder?: number }
): Promise<InformationSection> {
  const res = await fetchAdmin(`/api/admin/information`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create section')
  return res.json()
}

export async function updateInformation(
  id: string,
  data: Partial<Omit<InformationSection, 'id'>>
): Promise<InformationSection> {
  const res = await fetchAdmin(`/api/admin/information/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update section')
  return res.json()
}

export async function deleteInformation(id: string): Promise<void> {
  const res = await fetchAdmin(`/api/admin/information/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete section')
}

export async function toggleInformationVisibility(id: string): Promise<InformationSection> {
  const res = await fetchAdmin(`/api/admin/information/${id}/visibility`, {
    method: 'PATCH',
  })
  if (!res.ok) throw new Error('Failed to toggle visibility')
  return res.json()
}

export async function reorderInformation(orderedIds: string[]): Promise<InformationSection[]> {
  const res = await fetchAdmin(`/api/admin/information/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  })
  if (!res.ok) throw new Error('Failed to reorder sections')
  return res.json()
}
