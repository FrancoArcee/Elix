"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  MAX_IMAGE_SIZE_MB,
  validateImageFile,
} from "@/utils/image";
import { uploadImage, deleteImageByKey } from "@/services/products";

type ProductImagesFieldProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

const FORMAT_HINT = `JPG, PNG o WebP · hasta ${MAX_IMAGE_SIZE_MB} MB`;
const ERROR_MESSAGES = {
  format: "Alguno de los archivos tiene un formato no válido. Usá JPG, PNG o WebP.",
  size: `Alguno de los archivos supera el peso máximo de ${MAX_IMAGE_SIZE_MB} MB.`,
  upload: "No se pudieron subir las imágenes. Intentá con otros archivos.",
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

  const openPicker = () => inputRef.current?.click();

  const addFiles = async (files: FileList | File[] | null) => {
    if (!files || !files.length) return;
    const list = Array.from(files);
    if (inputRef.current) inputRef.current.value = "";

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
      const uploaded = await Promise.all(list.map((file) => uploadImage(file)));
      onChange([...images, ...uploaded.map((u) => u.url)]);
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
    if (url.includes("r2.cloudflarestorage.com")) {
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

  return (
    <div>
      <span className="flex items-center gap-2 pb-2">
        <span className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Imágenes del producto
        </span>
        <span className="border border-ink/10 px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[1.2px] text-muted">
          Opcional
        </span>
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(event) => void addFiles(event.target.files)}
      />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
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
              className={`relative h-[120px] w-[90px] shrink-0 overflow-hidden border bg-surface transition-transform ${
                dragIndex === index ? "scale-95 opacity-70" : ""
              } ${dragIndex !== null && dragIndex !== index ? "cursor-grab" : ""}`}
            >
              <Image
                src={image}
                alt={`Imagen ${index + 1}`}
                fill
                sizes="90px"
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-1.5">
                <span className="text-[8px] uppercase leading-3 tracking-[0.6px] text-white">
                  {index === 0 ? "Principal" : `${index + 1}`}
                </span>
                <button
                  type="button"
                  aria-label={`Eliminar imagen ${index + 1}`}
                  onClick={() => void handleRemove(index)}
                  className="flex size-4 items-center justify-center text-white transition-opacity hover:opacity-70"
                >
                  <Image
                    src="/icons/icon-trash.svg"
                    alt=""
                    width={9}
                    height={9}
                    className="size-[9px]"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {error && (
        <p aria-live="polite" className="pt-2 text-[11px] leading-4 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
