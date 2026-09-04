import { NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/r2'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const key = `uploads/${Date.now()}-${file.name}`

  const url = await uploadImage(key, buffer, file.type)

  return NextResponse.json({ url, key })
}

export async function DELETE(request: Request) {
  const { key } = await request.json()

  if (!key) {
    return NextResponse.json({ error: 'No key provided' }, { status: 400 })
  }

  await deleteImage(key)

  return NextResponse.json({ status: 'deleted' })
}
