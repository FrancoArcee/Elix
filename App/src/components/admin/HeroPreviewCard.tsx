import Image from "next/image";

type HeroPreviewCardProps = {
  imageUrl?: string | null;
  kicker: string;
  title: string;
};

export default function HeroPreviewCard({
  imageUrl,
  kicker,
  title,
}: HeroPreviewCardProps) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden border border-ink/10 bg-surface sm:aspect-auto sm:h-[258px]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 592px"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/5">
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Sin imagen
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[8px] font-medium uppercase leading-3 tracking-[2px] text-white/55">
          {kicker}
        </p>
        <p className="pt-1 font-serif text-[18px] font-bold leading-[24.75px] text-white">
          {title}
        </p>
      </div>
    </div>
  );
}
