import { z } from "zod";

export const productTargetAudienceEnum = z.enum(
  ["masculino", "femenino", "unisex"],
  { error: "Seleccioná una orientación válida" },
);

export const productConcentrationEnum = z.enum(
  ["edt", "edp", "edc", "extrait"],
  { error: "Seleccioná una concentración válida" },
);

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  brandId: z
    .string()
    .trim()
    .min(1, "Seleccioná una marca"),
  categoryId: z
    .string()
    .trim()
    .min(1, "Seleccioná una categoría"),
  targetAudience: productTargetAudienceEnum,
  concentration: productConcentrationEnum.optional().or(z.literal("")),
  olfactoryFamily: z.string().trim().optional(),
  price: z
    .string()
    .trim()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "El precio debe ser un número válido mayor o igual a 0",
    })
    .optional(),
  originalPrice: z
    .string()
    .trim()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "El precio original debe ser un número válido mayor o igual a 0",
    })
    .optional(),
  images: z.array(z.string()).optional(),
  sizes: z.string().trim().optional(),
  badge: z.string().trim().optional(),
  topNotes: z.string().trim().optional(),
  heartNotes: z.string().trim().optional(),
  baseNotes: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export const productApiSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  brandId: z
    .string()
    .trim()
    .min(1, "El ID de la marca es requerido"),
  categoryId: z
    .string()
    .trim()
    .min(1, "El ID de la categoría es requerido"),
  targetAudience: productTargetAudienceEnum,
  concentration: productConcentrationEnum.nullable().optional(),
  fraganceFamily: z.string().trim().nullable().optional(),
  price: z
    .union([z.number(), z.string().trim()])
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
  presentation: z.string().trim().nullable().optional(),
  badge: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  images: z
    .array(
      z.object({
        url: z.string().min(1, "La URL de la imagen es requerida"),
      }),
    )
    .optional(),
  notes: z
    .array(
      z.object({
        noteName: z.string().trim().min(1, "El nombre de la nota es requerido"),
        type: z.enum(["salida", "corazon", "fondo", "unico"]),
      }),
    )
    .optional(),
});

