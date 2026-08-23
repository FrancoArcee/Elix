"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  MAX_IMAGE_SIZE_MB,
  formatFileSize,
  readImageAsDataUrl,
  validateImageFile,
} from "@/utils/image";

type ImageDropzoneProps = {
  label: string;
  optional?: boolean;
  value?: string;
  onChange: (value: string | null) => void;
};

const FORMAT_HINT = `JPG, PNG o WebP · hasta ${MAX_IMAGE_SIZE_MB} MB`;

const ERROR_MESSAGES = {
  format: "Formato no válido. La imagen debe ser JPG, PNG o WebP.",
  size: `La imagen supera el peso máximo de ${MAX_IMAGE_SIZE_MB} MB.`,
  read: "No se pudo cargar la imagen. Intentá con otro archivo.",
};

function getInitialFileName(value?: string) {
  if (!value || value.startsWith("data:")) return "";
  const segments = value.split("/");
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export default function ImageDropzone({
  label,
  optional = false,
  value = "",
  onChange,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState(() => getInitialFileName(value));
  const [fileSize, setFileSize] = useState<number | null>(null);

  const hasImage = Boolean(value);

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    if (inputRef.current) inputRef.current.value = "";

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(ERROR_MESSAGES[validationError]);
      return;
    }

    try {
      const dataUrl = await readImageAsDataUrl(file);
      setError(null);
      setFileName(file.name);
      setFileSize(file.size);
      onChange(dataUrl);
    } catch {
      setError(ERROR_MESSAGES.read);
    }
  };

  const handleRemove = () => {
    setError(null);
    setFileName("");
    setFileSize(null);
    onChange(null);
  };

  return (
    <div>
      <span className="flex items-center gap-2 pb-2">
        <span className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          {label}
        </span>
        {optional && (
          <span className="border border-ink/10 px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[1.2px] text-muted">
            Opcional
          </span>
        )}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />

      {hasImage ? (
        <div className="flex items-center gap-4 border border-ink/10 bg-background p-3">
          <div className="relative size-16 shrink-0 overflow-hidden bg-surface">
            <Image
              src={value}
              alt={fileName || "Vista previa"}
              fill
              sizes="64px"
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] leading-[18px] text-ink">
              {fileName || "Imagen cargada"}
            </p>
            <p className="pt-0.5 text-[9px] uppercase leading-3 tracking-[1.2px] text-muted">
              {fileSize ? formatFileSize(fileSize) : FORMAT_HINT}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={openPicker}
              className="text-[8px] font-medium uppercase leading-3 tracking-[1.2px] text-muted transition-colors hover:text-ink"
            >
              Cambiar
            </button>
            <span className="h-3 w-px bg-ink/10" />
            <button
              type="button"
              onClick={handleRemove}
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
      ) : (
        <button
          type="button"
          onClick={openPicker}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            void handleFile(event.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center gap-2 border border-dashed px-4 py-9 text-center outline-none transition-colors focus-visible:border-ink/60 ${
            isDragging
              ? "border-ink/60 bg-surface"
              : "border-ink/20 hover:border-ink/40"
          }`}
        >
          <Image
            src="/icons/icon-upload.svg"
            alt=""
            width={16}
            height={16}
            className="size-4 opacity-80"
          />
          <span className="text-[12px] leading-[18px] text-muted">
            Arrastrá una imagen o{" "}
            <span className="font-medium text-ink underline underline-offset-2">
              seleccionala
            </span>
          </span>
          <span className="text-[8px] uppercase leading-3 tracking-[1.2px] text-muted">
            {FORMAT_HINT}
          </span>
        </button>
      )}

      {error && (
        <p aria-live="polite" className="pt-2 text-[11px] leading-4 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
