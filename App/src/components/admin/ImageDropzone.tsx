"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  MAX_IMAGE_SIZE_MB,
  validateImageFile,
} from "@/utils/image";
import { uploadImage, deleteImageByKey } from "@/services/upload";

type ImageDropzoneProps = {
  label: string;
  optional?: boolean;
  folder?: string;
  value?: string;
  onChange: (value: string | null) => void;
};

const FORMAT_HINT = `JPG, PNG o WebP · hasta ${MAX_IMAGE_SIZE_MB} MB`;

const ERROR_MESSAGES = {
  format: "Formato no válido. La imagen debe ser JPG, PNG o WebP.",
  size: `La imagen supera el peso máximo de ${MAX_IMAGE_SIZE_MB} MB.`,
  upload: "No se pudo subir la imagen. Intentá con otro archivo.",
};

function getKeyFromUrl(url: string): string | null {
  if (!url.includes("r2.dev")) return null;
  const parts = url.split("/");
  return parts.slice(-2).join("/");
}

export default function ImageDropzone({
  label,
  optional = false,
  folder,
  value = "",
  onChange,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState<string | null>(() =>
    value ? getKeyFromUrl(value) : null
  );

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

    setUploading(true);
    setError(null);
    try {
      const { url, key } = await uploadImage(file, folder);
      setImageKey(key);
      onChange(url);
    } catch {
      setError(ERROR_MESSAGES.upload);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setError(null);
    if (imageKey) {
      try { await deleteImageByKey(imageKey); } catch {}
    }
    setImageKey(null);
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
        <div className="relative border border-ink/10 bg-background p-3">
          <div className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden bg-surface">
              <Image
                src={value}
                alt="Vista previa"
                fill
                sizes="64px"
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                aria-label="Eliminar imagen"
                onClick={handleRemove}
                className="absolute top-0.5 right-0.5 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] leading-[18px] text-ink">
                Imagen subida
              </p>
              <p className="pt-0.5 text-[9px] uppercase leading-3 tracking-[1.2px] text-muted">
                {FORMAT_HINT}
              </p>
            </div>
            <button
              type="button"
              onClick={openPicker}
              className="shrink-0 text-[8px] font-medium uppercase leading-3 tracking-[1.2px] text-muted transition-colors hover:text-ink"
            >
              Cambiar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
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
          } ${uploading ? "opacity-50" : ""}`}
        >
          <Image
            src="/icons/icon-upload.svg"
            alt=""
            width={16}
            height={16}
            className="size-4 opacity-80"
          />
          <span className="text-[12px] leading-[18px] text-muted">
            {uploading ? (
              "Subiendo..."
            ) : (
              <>
                Arrastrá una imagen o{" "}
                <span className="font-medium text-ink underline underline-offset-2">
                  seleccionala
                </span>
              </>
            )}
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
