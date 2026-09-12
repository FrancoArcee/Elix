"use client";

import Image from "next/image";
import Link from "next/link";

type InfoSectionCardProps = {
  id: string;
  label: string;
  title: string;
  visible: boolean;
  displayNumber?: number;
  isSystem?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
};

export default function InfoSectionCard({
  id,
  label,
  title,
  visible,
  displayNumber,
  isSystem = false,
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onDelete,
}: InfoSectionCardProps) {
  return (
    <div
      className={`w-full overflow-hidden border bg-background transition-colors ${
        visible ? "border-ink/10" : "border-dashed border-ink/20 bg-ink/[0.01]"
      }`}
    >
      <div className="flex w-full min-w-0 items-center">
        <div className="flex shrink-0 flex-col items-center justify-center border-r border-ink/[0.06] px-2.5 py-3 sm:px-3">
          {displayNumber !== undefined && (
            <span className="font-serif text-[11px] font-bold text-muted/70">
              #{displayNumber}
            </span>
          )}
          <div className="flex flex-col gap-1 pt-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              aria-label={`Mover ${title} hacia arriba`}
              className="flex size-7 items-center justify-center border border-ink/10 text-ink transition-colors hover:bg-ink hover:text-background disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ink"
            >
              <svg
                className="size-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              aria-label={`Mover ${title} hacia abajo`}
              className="flex size-7 items-center justify-center border border-ink/10 text-ink transition-colors hover:bg-ink hover:text-background disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ink"
            >
              <svg
                className="size-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {isSystem ? (
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3.5 py-3.5 text-left sm:gap-4 sm:px-5 sm:py-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <p className="text-[8px] font-medium uppercase leading-3 tracking-[2px] text-muted">
                  {label}
                </p>
                <span className="border border-ink/15 bg-ink/[0.04] px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-[1px] text-muted sm:text-[8px]">
                  Sección del sistema
                </span>
              </div>
              <p className="truncate pt-1 font-serif text-[15px] font-bold leading-[22px] text-ink sm:text-[16px]">
                {title}
              </p>
            </div>
          </div>
        ) : (
          <Link
            href={`/admin/information/${id}`}
            className="group flex min-w-0 flex-1 items-center justify-between gap-3 px-3.5 py-3.5 text-left transition-colors hover:bg-ink/[0.015] sm:gap-4 sm:px-5 sm:py-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-medium uppercase leading-3 tracking-[2px] text-muted">
                {label}
              </p>
              <p className="truncate pt-0.5 font-serif text-[15px] font-bold leading-[22px] text-ink group-hover:text-ink/80 sm:text-[16px]">
                {title}
              </p>
            </div>
            <Image
              src="/icons/icon-chevron-right-13.svg"
              alt=""
              width={13}
              height={13}
              className="size-[13px] shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-2.5 border-t border-ink/[0.06] bg-ink/[0.015] px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-[8px] uppercase tracking-[1.4px] text-muted">
            Estado:
          </span>
          {isSystem ? (
            <span className="inline-flex items-center gap-1.5 border border-emerald-700/25 bg-emerald-600/[0.08] px-2 py-0.5 text-[8px] font-medium uppercase tracking-[1.2px] text-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              Visible siempre
            </span>
          ) : visible ? (
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

        <div className="flex flex-wrap items-center gap-3">
          {!isSystem && onToggleVisibility && (
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

          {!isSystem && onDelete && (
            <>
              {onToggleVisibility && <span className="h-3 w-px bg-ink/10" />}
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
