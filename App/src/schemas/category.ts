import { z } from "zod";

const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z
    .string()
    .trim()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  color: z
    .string()
    .trim()
    .regex(hexColorRegex, "Ingresá un color hexadecimal válido (ej: #F2F1EE)"),
  imageUrl: z.string().trim().optional().or(z.literal("")),
});

export const categoryUpdateSchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
