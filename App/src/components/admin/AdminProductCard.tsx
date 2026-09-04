import Image from "next/image";
import Link from "next/link";

type AdminProductCardProps = {
  image: string;
  brand: string;
  name: string;
  badge?: string;
  outOfStock?: boolean;
  href?: string;
};

function CardContent({
  image,
  brand,
  name,
  badge,
  outOfStock,
}: Omit<AdminProductCardProps, "href">) {
  return (
    <>
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 266px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {(badge || outOfStock) && (
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          {badge && (
            <span className="bg-background px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[0.96px] text-ink">
              {badge}
            </span>
          )}
          {outOfStock && (
            <span className="bg-black/60 px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[0.96px] text-white">
              Sin stock
            </span>
          )}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-[8px] uppercase leading-3 tracking-[1.2px] text-white/60">
          {brand}
        </p>
        <p className="pt-0.5 font-serif text-[14px] font-bold leading-[17.5px] text-white">
          {name}
        </p>
      </div>
    </>
  );
}

export default function AdminProductCard({
  image,
  brand,
  name,
  badge,
  outOfStock = false,
  href,
}: AdminProductCardProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-surface transition-opacity hover:opacity-90"
      >
        <CardContent
          image={image}
          brand={brand}
          name={name}
          badge={badge}
          outOfStock={outOfStock}
        />
      </Link>
    );
  }

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
      <CardContent
        image={image}
        brand={brand}
        name={name}
        badge={badge}
        outOfStock={outOfStock}
      />
    </div>
  );
}
