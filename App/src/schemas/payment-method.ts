import { z } from "zod";

export const paymentMethodFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre del método de pago debe tener al menos 2 caracteres"),
  identifier: z.string().trim().optional().or(z.literal("")),
});

export const paymentMethodApiSchema = z.object({
  method: z
    .string()
    .trim()
    .min(2, "El nombre del método de pago debe tener al menos 2 caracteres"),
  identifier: z.string().trim().nullable().optional().or(z.literal("")),
});

export const paymentMethodUpdateSchema = paymentMethodApiSchema.partial();

export const paymentMethodSchema = paymentMethodApiSchema;

export type PaymentMethodFormInput = z.infer<typeof paymentMethodFormSchema>;
export type PaymentMethodApiInput = z.infer<typeof paymentMethodApiSchema>;
export type PaymentMethodUpdateInput = z.infer<
  typeof paymentMethodUpdateSchema
>;
