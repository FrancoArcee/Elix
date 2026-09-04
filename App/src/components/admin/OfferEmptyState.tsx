"use client";

type OfferEmptyStateProps = {
  title?: string;
  hint?: string;
};

export default function OfferEmptyState({
  title = "No hay ninguna oferta activa.",
  hint = "Activá una oferta con el toggle o creá una nueva.",
}: OfferEmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center border border-dashed border-ink/10 px-6 py-8">
      <p className="text-center text-[14px] leading-5 text-muted">{title}</p>
      <p className="pt-1 text-center text-[10px] leading-[15px] text-muted/60">
        {hint}
      </p>
    </div>
  );
}
