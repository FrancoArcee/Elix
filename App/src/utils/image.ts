export const ACCEPTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export type ImageValidationError = "format" | "size";

export function validateImageFile(file: File): ImageValidationError | null {
  const type = file.type.toLowerCase();
  const validExtension = /\.(jpe?g|png|webp)$/i.test(file.name);
  const isAcceptedFormat =
    (ACCEPTED_IMAGE_FORMATS as readonly string[]).includes(type) ||
    validExtension;

  if (!isAcceptedFormat) return "format";
  if (file.size > MAX_IMAGE_SIZE_BYTES) return "size";
  return null;
}
