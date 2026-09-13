import Image from "next/image";
import Link from "next/link";

type AdminProductCardProps = {
  image: string | null;
  brand: string;
  name: string;
  badge?: string;
  href?: string;
  isFeatured?: boolean;
  onToggleFeatured?: () => void;
  featuredDisabled?: boolean;
};

function CardContent({
  image,
  brand,
  name,
  badge,
}: Omit<AdminProductCardProps, "href" | "isFeatured" | "onToggleFeatured" | "featuredDisabled">) {
  return (
    <>
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 266px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface">
          <p className="text-[9px] uppercase tracking-[1.35px] text-muted">
            Sin imagen
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {badge && (
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          <span className="bg-background px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[0.96px] text-ink">
            {badge}
          </span>
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
  href,
  isFeatured,
  onToggleFeatured,
  featuredDisabled,
}: AdminProductCardProps) {
  const starButton = onToggleFeatured ? (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFeatured();
      }}
      disabled={featuredDisabled && !isFeatured}
      className="absolute right-2.5 top-2.5 z-10 flex size-[28px] items-center justify-center bg-black/40 transition-colors hover:bg-black/60 disabled:opacity-30"
      aria-label={isFeatured ? "Quitar de destacados" : "Agregar a destacados"}
      title={isFeatured ? "Quitar de destacados" : featuredDisabled ? "Máximo 6 destacados" : "Agregar a destacados"}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={isFeatured ? "#facc15" : "none"}
        stroke={isFeatured ? "#facc15" : "white"}
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  ) : null;

  if (href) {
    return (
      <Link
        href={href}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-surface transition-opacity hover:opacity-90"
      >
        {starButton}
        <CardContent
          image={image}
          brand={brand}
          name={name}
          badge={badge}
        />
      </Link>
    );
  }

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
      {starButton}
      <CardContent
        image={image}
        brand={brand}
        name={name}
        badge={badge}
      />
    </div>
  );
}
