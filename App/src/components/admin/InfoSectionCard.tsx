"use client";

import Image from "next/image";
import Link from "next/link";

type InfoSectionCardProps = {
  id: string;
  label: string;
  title: string;
  visible: boolean;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
};

export default function InfoSectionCard({
  id,
  label,
  title,
  visible,
  onToggleVisibility,
  onDelete,
}: InfoSectionCardProps) {
  return (
    <div className="border border-ink/10 bg-background">
      <Link
        href={`/admin/information/${id}`}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-[8px] font-medium uppercase leading-3 tracking-[2px] text-muted">
            {label}
          </p>
          <p className="truncate pt-0.5 font-serif text-[16px] font-bold leading-[22px] text-ink">
            {title}
          </p>
        </div>
        <Image
          src="/icons/icon-chevron-right-13.svg"
          alt=""
          width={13}
          height={13}
          className="size-[13px] shrink-0"
        />
      </Link>

      <div className="flex items-center justify-between border-t border-ink/[0.05] px-5 py-2.5">
        <div className="flex items-center gap-1.5">
          <Image
            src={visible ? "/icons/icon-eye.svg" : "/icons/icon-eye-off.svg"}
            alt=""
            width={11}
            height={11}
            className={`size-[11px] ${visible ? "" : "opacity-70"}`}
          />
          <span className="text-[8px] uppercase leading-3 tracking-[1.44px] text-ink">
            {visible ? "Visible" : "Oculta"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onToggleVisibility && (
            <>
              <button
                type="button"
                onClick={onToggleVisibility}
                className="flex items-center gap-1 text-[8px] font-medium uppercase leading-3 tracking-[1.2px] text-muted transition-colors hover:text-ink"
              >
                <Image
                  src="/icons/icon-eye-off.svg"
                  alt=""
                  width={11}
                  height={11}
                  className="size-[11px]"
                />
                {visible ? "Ocultar" : "Mostrar"}
              </button>
              <span className="h-3 w-px bg-ink/10" />
            </>
          )}
          {onDelete && (
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
          )}
        </div>
      </div>
    </div>
  );
}
