import { Prisma } from '@prisma/client'
import { deleteImage } from '@/lib/r2'

type ProductWithImages = {
  id: string
  images: { imageUrl: string }[]
}

export async function deleteProductImagesFromR2(product: ProductWithImages) {
  for (const img of product.images) {
    if (img.imageUrl.includes('r2.dev')) {
      const key = img.imageUrl.split('/').slice(-2).join('/')
      try { await deleteImage(key) } catch {}
    }
  }
}

export async function deleteProductCascade(
  tx: Prisma.TransactionClient,
  productId: string
) {
  await tx.productNote.deleteMany({ where: { productId } })
  await tx.productImage.deleteMany({ where: { productId } })
  await tx.featuredProduct.deleteMany({ where: { productId } })
  await tx.productVolume.deleteMany({ where: { productId } })
  await tx.product.delete({ where: { id: productId } })
}
