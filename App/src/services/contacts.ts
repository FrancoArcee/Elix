import { fetchAdmin } from '@/lib/fetch-admin'

export interface ContactData {
  id: string
  application: string
  value: string
  displayOrder: number
}

export async function getContacts(): Promise<ContactData[]> {
  const res = await fetch(`/api/contacts`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getAdminContacts(): Promise<ContactData[]> {
  const res = await fetchAdmin(`/api/admin/contacts`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function createContact(
  data: Omit<ContactData, 'id' | 'displayOrder'> & { displayOrder?: number }
): Promise<ContactData> {
  const res = await fetchAdmin(`/api/admin/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create contact')
  return res.json()
}

export async function updateContact(
  id: string,
  data: Partial<Omit<ContactData, 'id'>>
): Promise<ContactData> {
  const res = await fetchAdmin(`/api/admin/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update contact')
  return res.json()
}

export async function deleteContact(id: string): Promise<void> {
  const res = await fetchAdmin(`/api/admin/contacts/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete contact')
}
