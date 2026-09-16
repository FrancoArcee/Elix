import { z } from "zod";

export const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre de la marca debe tener al menos 2 caracteres"),
});

