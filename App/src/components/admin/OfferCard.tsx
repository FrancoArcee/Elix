"use client";

import Image from "next/image";
import type { OfferCategory } from "@/context/adminStore";

type OfferCardProps = {
  discount: number;
  paymentMethod: string;
  description: string;
  categories: OfferCategory[];
  active: boolean;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function OfferCard({
  discount,
  paymentMethod,
  description,
  categories,
  active,
  onToggleActive,
  onEdit,
  onDelete,
}: OfferCardProps) {
  return (
    <div
      className={`flex w-full flex-col gap-4 border px-5 py-4 sm:flex-row sm:items-start sm:gap-4 ${
        active ? "border-ink" : "border-ink/10"
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center self-start ${
          active
            ? "border border-ink bg-ink"
            : "border border-ink/10 bg-transparent"
        }`}
      >
        <span
          className={`font-serif text-[20px] font-bold leading-5 whitespace-nowrap ${
            active ? "text-background" : "text-ink"
          }`}
        >
          {discount}%
        </span>
        <span
          className={`pt-0.5 text-[7px] uppercase leading-[10.5px] tracking-[1.05px] ${
            active ? "text-background/60" : "text-muted"
          }`}
        >
          off
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start">
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[1.8px] text-muted">
          {paymentMethod}
        </p>
        <p className="truncate pt-1 text-[14px] leading-5 text-ink">
          {description}
        </p>
        {categories.length > 0 && (
          <div className="flex flex-wrap items-start gap-1 pt-1.5">
            {categories.map((category) => (
              <span
                key={category}
                className="border border-ink/10 px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[0.8px] text-muted"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 self-start sm:pl-2">
        <button
          type="button"
          role="switch"
          aria-checked={active}
          aria-label={active ? "Desactivar oferta" : "Activar oferta"}
          onClick={onToggleActive}
          className={`relative h-5 w-10 rounded-full transition-colors ${
            active ? "bg-ink" : "bg-ink/10"
          }`}
        >
          <span
            className={`absolute top-0.5 size-4 rounded-full bg-background transition-all ${
              active ? "left-5" : "left-0.5"
            }`}
          />
        </button>
        <button
          type="button"
          aria-label="Editar oferta"
          onClick={onEdit}
          className="flex items-center justify-center text-muted transition-colors hover:text-ink"
        >
          <Image
            src="/icons/icon-edit.svg"
            alt=""
            width={13}
            height={13}
            className="size-[13px]"
          />
        </button>
        <button
          type="button"
          aria-label="Eliminar oferta"
          onClick={onDelete}
          className="flex items-center justify-center text-muted transition-colors hover:text-ink"
        >
          <Image
            src="/icons/icon-trash.svg"
            alt=""
            width={13}
            height={13}
            className="size-[13px]"
          />
        </button>
      </div>
    </div>
  );
}
