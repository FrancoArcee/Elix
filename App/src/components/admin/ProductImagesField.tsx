"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  MAX_IMAGE_SIZE_MB,
  validateImageFile,
} from "@/utils/image";
import { uploadImage, deleteImageByKey } from "@/services/upload";

type ProductImagesFieldProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

const MAX_IMAGES = 5;
const FORMAT_HINT = `JPG, PNG o WebP · hasta ${MAX_IMAGE_SIZE_MB} MB · Máximo ${MAX_IMAGES} imágenes`;
const ERROR_MESSAGES = {
  format: "Alguno de los archivos tiene un formato no válido. Usá JPG, PNG o WebP.",
  size: `Alguno de los archivos supera el peso máximo de ${MAX_IMAGE_SIZE_MB} MB.`,
  upload: "No se pudieron subir las imágenes. Intentá con otros archivos.",
  maxLimit: `Un producto puede tener como máximo ${MAX_IMAGES} imágenes en total.`,
};

export default function ProductImagesField({
  images,
  onChange,
}: ProductImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = () => {
    if (images.length >= MAX_IMAGES) return;
    inputRef.current?.click();
  };

  const addFiles = async (files: FileList | File[] | null) => {
    if (!files || !files.length) return;
    const list = Array.from(files);
    if (inputRef.current) inputRef.current.value = "";

    const availableSlots = MAX_IMAGES - images.length;
    if (availableSlots <= 0) {
      setError(ERROR_MESSAGES.maxLimit);
      return;
    }

    if (list.length > availableSlots) {
      setError(
        `Solo podés agregar hasta ${availableSlots} imagen${
          availableSlots > 1 ? "es" : ""
        } más (máximo ${MAX_IMAGES} en total).`,
      );
      return;
    }

    for (const file of list) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(ERROR_MESSAGES[validationError]);
        return;
      }
    }

    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(list.map((file) => uploadImage(file, 'products')));
      onChange([...images, ...uploaded.map((u) => u.url)].slice(0, MAX_IMAGES));
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.upload);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const url = images[index];
    const next = images.filter((_, i) => i !== index);
    onChange(next);
    if (url.includes("r2.dev")) {
      const key = url.split("/").slice(-2).join("/");
      try { await deleteImageByKey(key); } catch {}
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
    setDragIndex(null);
  };

  const moveLeft = (index: number) => {
    if (index <= 0) return;
    const next = [...images];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onChange(next);
  };

  const moveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const next = [...images];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
            Imágenes del producto
          </span>
          <span className="text-[9px] font-medium text-muted">
            ({images.length}/{MAX_IMAGES})
          </span>
        </div>
        <span className="border border-ink/10 px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[1.2px] text-muted">
          Opcional
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(event) => void addFiles(event.target.files)}
      />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 pb-2">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDragEnter={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleDrop(index);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`group relative h-[130px] w-[96px] shrink-0 overflow-hidden border border-ink/10 bg-surface transition-all ${
                dragIndex === index ? "scale-95 opacity-70" : ""
              } ${dragIndex !== null && dragIndex !== index ? "cursor-grab" : ""}`}
            >
              <Image
                src={image}
                alt={`Imagen ${index + 1}`}
                fill
                sizes="96px"
                unoptimized
                className="object-cover"
              />

              <div className="absolute left-1.5 top-1.5 z-10">
                {index === 0 ? (
                  <span className="bg-ink px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[1px] text-background">
                    Principal
                  </span>
                ) : (
                  <span className="bg-black/65 px-1.5 py-0.5 text-[8px] font-medium text-white">
                    #{index + 1}
                  </span>
                )}
              </div>

              <button
                type="button"
                aria-label={`Eliminar imagen ${index + 1}`}
                onClick={() => void handleRemove(index)}
                className="absolute right-1.5 top-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-red-600"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {images.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 pt-4">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLeft(index);
                    }}
                    aria-label="Mover imagen hacia la izquierda"
                    className="flex size-6 items-center justify-center rounded bg-black/60 text-white transition-opacity hover:bg-black disabled:invisible"
                  >
                    <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveRight(index);
                    }}
                    aria-label="Mover imagen hacia la derecha"
                    className="flex size-6 items-center justify-center rounded bg-black/60 text-white transition-opacity hover:bg-black disabled:invisible"
                  >
                    <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < MAX_IMAGES ? (
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
            void addFiles(event.dataTransfer.files);
          }}
          className={`mt-3 flex w-full flex-col items-center gap-2 border border-dashed px-4 py-6 text-center outline-none transition-colors focus-visible:border-ink/60 ${
            isDragging ? "border-ink/60 bg-surface" : "border-ink/20 hover:border-ink/40"
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
                Arrastrá una o varias imágenes o{" "}
                <span className="font-medium text-ink underline underline-offset-2">
                  seleccionalas
                </span>
              </>
            )}
          </span>
          <span className="text-[8px] uppercase leading-3 tracking-[1.2px] text-muted">
            {FORMAT_HINT}
          </span>
        </button>
      ) : (
        <div className="mt-3 flex w-full items-center justify-center border border-dashed border-ink/15 bg-ink/[0.02] py-4 text-center">
          <span className="text-[11px] text-muted">
            Límite máximo alcanzado (5/5 imágenes). Eliminá una imagen para poder agregar otra.
          </span>
        </div>
      )}

      {error && (
        <p aria-live="polite" className="pt-2 text-[11px] leading-4 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
