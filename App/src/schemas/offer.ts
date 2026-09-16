import { z } from "zod";

export const offerFormSchema = z.object({
  discount: z
    .string()
    .trim()
    .min(1, "El descuento es requerido")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1 && num <= 100;
    }, "El descuento debe ser un porcentaje entre 1 y 100"),
  paymentMethod: z
    .string()
    .trim()
    .min(1, "Seleccioná o ingresá un método de pago"),
  categories: z
    .array(z.string())
    .min(1, "Seleccioná al menos una categoría"),
  description: z.string().trim().optional(),
});

export const offerApiSchema = z.object({
  discount: z.union([
    z
      .number()
      .min(1, "El descuento mínimo es 1%")
      .max(100, "El descuento máximo es 100%"),
    z.string().refine((val) => {
      const n = Number(val);
      return !isNaN(n) && n >= 1 && n <= 100;
    }, "El descuento debe estar entre 1 y 100"),
  ]),
  paymentMethod: z
    .string()
    .trim()
    .min(1, "El método de pago es requerido"),
  categories: z
    .array(z.string())
    .min(1, "Debes incluir al menos una categoría"),
  description: z.string().trim().nullable().optional(),
  active: z.boolean().optional(),
});

export const offerApiUpdateSchema = offerApiSchema.partial();

