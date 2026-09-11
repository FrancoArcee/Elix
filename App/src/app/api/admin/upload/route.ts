import { NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/r2'
import { getAdminSession } from '@/lib/admin'

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const folder = (formData.get('folder') as string) || 'uploads'
  const key = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

  try {
    const url = await uploadImage(key, buffer, file.type || 'image/jpeg')
    return NextResponse.json({ url, key })
  } catch (error) {
    console.error('Error uploading to R2:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al subir la imagen' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { key } = await request.json()

  if (!key) {
    return NextResponse.json({ error: 'No key provided' }, { status: 400 })
  }

  try {
    await deleteImage(key)
    return NextResponse.json({ status: 'deleted' })
  } catch (error) {
    console.error('Error deleting from R2:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar la imagen' },
      { status: 500 }
    )
  }
}
