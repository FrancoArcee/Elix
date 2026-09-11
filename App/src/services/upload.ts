import { fetchAdmin } from '@/lib/fetch-admin'

export async function uploadImage(file: File, folder?: string): Promise<{ url: string; key: string }> {
  const formData = new FormData()
  formData.append('file', file)
  if (folder) formData.append('folder', folder)
  const res = await fetchAdmin('/api/admin/upload', { method: 'POST', body: formData })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error || 'Failed to upload image')
  }
  return res.json()
}

export async function deleteImageByKey(key: string): Promise<void> {
  const res = await fetchAdmin('/api/admin/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  })
  if (!res.ok) throw new Error('Failed to delete image')
}
