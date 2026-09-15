import { z } from "zod";

export const heroSchema = z.object({
  kicker: z
    .string()
    .trim()
    .min(2, "El kicker debe tener al menos 2 caracteres"),
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres"),
  imageUrl: z
    .string()
    .trim()
    .min(1, "La imagen de fondo es requerida"),
});

export const informationSectionSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "El label debe tener al menos 2 caracteres"),
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .trim()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  visible: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const informationSectionUpdateSchema = informationSectionSchema.partial();

export type HeroInput = z.infer<typeof heroSchema>;
export type InformationSectionInput = z.infer<typeof informationSectionSchema>;
export type InformationSectionUpdateInput = z.infer<
  typeof informationSectionUpdateSchema
>;
