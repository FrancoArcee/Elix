import Image from "next/image";
import Link from "next/link";

type AdminCategoryCardProps = {
  name: string;
  image: string;
  href?: string;
};

function CardContent({ name, image }: Omit<AdminCategoryCardProps, "href">) {
  return (
    <>
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 640px) 100vw, 328px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-serif text-[20px] font-bold leading-[25px] text-white">
          {name}
        </p>
      </div>
    </>
  );
}

export default function AdminCategoryCard({
  name,
  image,
  href,
}: AdminCategoryCardProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="relative block aspect-[3/2] w-full overflow-hidden bg-surface transition-opacity hover:opacity-90 sm:aspect-auto sm:h-[246px]"
      >
        <CardContent name={name} image={image} />
      </Link>
    );
  }

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface sm:aspect-auto sm:h-[246px]">
      <CardContent name={name} image={image} />
    </div>
  );
}
