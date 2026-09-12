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
    <div
      className={`border bg-background transition-colors ${
        visible ? "border-ink/10" : "border-dashed border-ink/20 bg-ink/[0.01]"
      }`}
    >
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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.06] bg-ink/[0.015] px-5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[8px] uppercase tracking-[1.4px] text-muted">
            Estado:
          </span>
          {visible ? (
            <span className="inline-flex items-center gap-1.5 border border-emerald-700/25 bg-emerald-600/[0.08] px-2 py-0.5 text-[8px] font-medium uppercase tracking-[1.2px] text-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              Visible en la web
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 border border-ink/15 bg-background px-2 py-0.5 text-[8px] font-medium uppercase tracking-[1.2px] text-muted">
              <span className="size-1.5 rounded-full bg-muted/60" />
              Oculta
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onToggleVisibility && (
            <button
              type="button"
              onClick={onToggleVisibility}
              aria-label={visible ? "Ocultar esta sección de la web" : "Mostrar esta sección en la web"}
              className={`flex items-center gap-1.5 border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[1px] transition-colors ${
                visible
                  ? "border-ink/20 bg-background text-ink hover:border-ink hover:bg-ink/[0.04]"
                  : "border-ink bg-ink text-background hover:bg-ink/85"
              }`}
            >
              <Image
                src={visible ? "/icons/icon-eye-off.svg" : "/icons/icon-eye.svg"}
                alt=""
                width={11}
                height={11}
                className={`size-[11px] ${!visible ? "invert" : ""}`}
              />
              {visible ? "Ocultar sección" : "Mostrar en web"}
            </button>
          )}

          {onDelete && (
            <>
              <span className="h-3 w-px bg-ink/10" />
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1 text-[8px] font-medium uppercase leading-3 tracking-[1.2px] text-muted transition-colors hover:text-red-600"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
