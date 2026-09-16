import { revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type PublicDataTag =
  | "public-categories"
  | "public-offer"
  | "public-hero"
  | "public-featured"
  | "public-contacts";

export const getPublicCategories = unstable_cache(
  () => prisma.category.findMany({ orderBy: { name: "asc" } }),
  ["public-categories"],
  { revalidate: 300, tags: ["public-categories"] },
);

export const getPublicHero = unstable_cache(
  () => prisma.hero.findFirst(),
  ["public-hero"],
  { revalidate: 300, tags: ["public-hero"] },
);

export const getPublicContacts = unstable_cache(
  () => prisma.contact.findMany({ orderBy: { displayOrder: "asc" } }),
  ["public-contacts"],
  { revalidate: 300, tags: ["public-contacts"] },
);

export const getPublicFeaturedProducts = unstable_cache(
  async () => {
    const featured = await prisma.featuredProduct.findMany({
      orderBy: { displayOrder: "asc" },
      take: 6,
      include: {
        product: {
          include: {
            brand: true,
            images: { orderBy: { displayOrder: "asc" }, take: 1 },
          },
        },
      },
    });

    return featured.map(({ product }) => ({
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      image: product.images[0]?.imageUrl ?? null,
    }));
  },
  ["public-featured"],
  { revalidate: 300, tags: ["public-featured"] },
);

export const getPublicActiveOffers = unstable_cache(
  async () => {
    const [offers, allCategoryCount] = await Promise.all([
      prisma.offer.findMany({
        where: { active: true },
        orderBy: { id: "desc" },
        include: {
          offerCategories: { include: { category: true } },
          offerPaymentMethods: { include: { paymentMethod: true } },
        },
      }),
      prisma.category.count(),
    ]);

    return offers.map((offer) => {
      const categories = offer.offerCategories.map(({ category }) => category.name);
      const isAllCategories = categories.length === allCategoryCount && allCategoryCount > 0;

      return {
        discount: Number(offer.discount),
        paymentMethod: offer.offerPaymentMethods[0]?.paymentMethod.method ?? "",
        categories: isAllCategories ? ["Toda la colección"] : categories,
        categoryId: !isAllCategories && offer.offerCategories[0]
          ? offer.offerCategories[0].category.id
          : null,
        description: offer.description ?? "",
      };
    });
  },
  ["public-offer"],
  { revalidate: 300, tags: ["public-offer"] },
);

export const getPublicHomeData = unstable_cache(
  async () => {
    const [offers, categories, hero, featuredProducts, contacts] = await Promise.all([
      getPublicActiveOffers(),
      getPublicCategories(),
      getPublicHero(),
      getPublicFeaturedProducts(),
      getPublicContacts(),
    ]);

    return { offers, categories, hero, featuredProducts, contacts };
  },
  ["public-home"],
  {
    revalidate: 300,
    tags: [
      "public-categories",
      "public-offer",
      "public-hero",
      "public-featured",
      "public-contacts",
    ],
  },
);

export function revalidatePublicData(...tags: PublicDataTag[]) {
  tags.forEach((tag) => revalidateTag(tag));
}
