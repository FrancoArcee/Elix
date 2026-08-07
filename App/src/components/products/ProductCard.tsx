import Image from "next/image";
import Link from "next/link";

export type ProductCardProps = {
  image: string;
  brand: string;
  name: string;
  badge?: string;
  surface?: "surface" | "surface-alt";
  href: string;
};

export default function ProductCard({
  image,
  brand,
  name,
  badge,
  surface = "surface",
  href,
}: ProductCardProps) {
  return (
    <Link href={href} className="group flex flex-col">
      <div
        className={`relative h-[362px] w-full overflow-hidden ${
          surface === "surface" ? "bg-surface" : "bg-surface-alt"
        }`}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[9px] font-medium uppercase tracking-[1.35px] text-background">
            {badge}
          </span>
        )}
      </div>

      <div className="flex w-full flex-col pt-3 pb-4">
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[1.8px] text-muted">
          {brand}
        </p>
        <p className="mt-0.5 font-serif text-[14px] font-semibold leading-[19.25px] text-ink">
          {name}
        </p>
        <div className="h-5 pt-3" />
      </div>
    </Link>
  );
}
