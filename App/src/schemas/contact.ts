import { z } from "zod";

export const contactSchema = z
  .object({
    application: z
      .string()
      .trim()
      .min(1, "Seleccioná una red o medio de contacto"),
    value: z.string().trim().min(1, "El dato de contacto es requerido"),
    isPrimary: z.boolean().optional(),
    displayOrder: z.number().int().optional(),
  })
  .superRefine((data, ctx) => {
    const app = data.application.toLowerCase();
    const raw = data.value.trim();

    if (app === "email") {
      const emailResult = z.string().email().safeParse(raw);
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresá un email válido (ej: contacto@elix.com)",
          path: ["value"],
        });
      }
    } else if (app === "whatsapp" || app === "teléfono" || app === "telefono") {
      const digits = raw.replace(/[^0-9]/g, "");
      if (digits.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresá un número de teléfono válido (mínimo 8 dígitos)",
          path: ["value"],
        });
      }
    } else {
      if (raw.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El usuario o enlace debe tener al menos 2 caracteres",
          path: ["value"],
        });
      }
    }
  });

export const contactUpdateSchema = z.object({
  application: z.string().trim().min(1).optional(),
  value: z.string().trim().min(1).optional(),
  isPrimary: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

