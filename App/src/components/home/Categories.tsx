import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Categories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (categories.length === 0) return null;

  return (
    <section id="categorias" className="mx-auto w-full max-w-[1280px] px-4 py-16 md:px-6 md:py-24">
      <p className="text-[9px] uppercase leading-[13.5px] tracking-[3.15px] text-muted">
        Explorar por
      </p>
      <h2 className="mt-3 font-serif text-[30px] leading-9 text-ink md:text-[36px] md:leading-10">
        Categorías
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {categories.map((category: { id: string; name: string; description: string; urlImage: string | null }) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className="group relative block aspect-[3/4] overflow-hidden bg-surface"
          >
            {category.urlImage && (
              <Image
                src={category.urlImage}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="font-serif text-[24px] leading-8 text-white">
                {category.name}
              </h3>
              <p className="mt-1 text-[12px] leading-4 text-white/65">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
