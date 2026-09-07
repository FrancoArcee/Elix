import { fetchAdmin } from '@/lib/fetch-admin'

export interface PaymentMethodData {
  id: string
  method: string
  identifier: string | null
}

export async function getAdminPaymentMethods(): Promise<PaymentMethodData[]> {
  const res = await fetchAdmin(`/api/admin/payment-methods`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function createPaymentMethod(
  data: Omit<PaymentMethodData, 'id'>
): Promise<PaymentMethodData> {
  const res = await fetchAdmin(`/api/admin/payment-methods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create payment method')
  return res.json()
}

export async function updatePaymentMethod(
  id: string,
  data: Partial<Omit<PaymentMethodData, 'id'>>
): Promise<PaymentMethodData> {
  const res = await fetchAdmin(`/api/admin/payment-methods/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update payment method')
  return res.json()
}

export async function deletePaymentMethod(id: string): Promise<void> {
  const res = await fetchAdmin(`/api/admin/payment-methods/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete payment method')
}
