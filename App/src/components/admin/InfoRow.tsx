"use client";

import Image from "next/image";

type InfoRowProps = {
  name: string;
  value?: string;
  emptyLabel?: string;
  isPrimary?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetPrimary?: () => void;
};

export default function InfoRow({
  name,
  value,
  emptyLabel = "Sin identificador",
  isPrimary,
  onEdit,
  onDelete,
  onSetPrimary,
}: InfoRowProps) {
  const hasValue = Boolean(value);

  return (
    <div className="flex flex-col gap-3 border border-ink/10 bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[8px] uppercase leading-3 tracking-[2px] text-muted">
            {name}
          </p>
          {isPrimary && (
            <span className="border border-ink/15 bg-ink/[0.03] px-1.5 py-0.5 text-[7px] font-medium uppercase leading-2 tracking-[1.2px] text-muted">
              Principal
            </span>
          )}
        </div>
        {hasValue ? (
          <p className="truncate pt-0.5 text-[14px] leading-5 text-ink">
            {value}
          </p>
        ) : (
          <p className="pt-0.5 text-[12px] italic leading-4 text-muted">
            {emptyLabel}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {onSetPrimary && !isPrimary && (
          <>
            <button
              type="button"
              onClick={onSetPrimary}
              className="text-[8px] font-medium uppercase leading-3 tracking-[1.2px] text-muted transition-colors hover:text-ink"
            >
              Marcar principal
            </button>
            <span className="h-3 w-px bg-ink/10" />
          </>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="text-[8px] font-medium uppercase leading-3 tracking-[1.2px] text-muted transition-colors hover:text-ink"
        >
          Editar
        </button>
        <span className="h-3 w-px bg-ink/10" />
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1 text-[8px] font-medium uppercase leading-3 tracking-[1.2px] text-muted transition-colors hover:text-ink"
        >
          <Image
            src="/icons/icon-trash.svg"
            alt=""
            width={11}
            height={11}
            className="size-[11px]"
          />
          Eliminar
        </button>
      </div>
    </div>
  );
}
