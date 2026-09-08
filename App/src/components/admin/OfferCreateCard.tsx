"use client";

import Image from "next/image";
import OfferForm, { type OfferFormValues } from "./OfferForm";

type OfferCreateCardProps = {
  open: boolean;
  onToggle: () => void;
  paymentMethods: { name: string }[];
  categories: { name: string }[];
  onSubmit: (values: OfferFormValues) => void;
  onCancel: () => void;
};

export default function OfferCreateCard({
  open,
  onToggle,
  paymentMethods,
  categories,
  onSubmit,
  onCancel,
}: OfferCreateCardProps) {
  return (
    <div className="flex w-full flex-col items-start border border-ink bg-background">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-ink px-5 py-4 text-left"
      >
        <p className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-background">
          Nueva oferta
        </p>
        <Image
          src="/icons/icon-chevron-down.svg"
          alt=""
          width={14}
          height={14}
          className={`size-[14px] text-background transition-transform ${
            open ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {open && (
        <OfferForm
          paymentMethods={paymentMethods}
          categories={categories}
          editing={false}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}
