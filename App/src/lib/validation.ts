import { NextResponse } from "next/server";
import { type ZodType } from "zod";

export type ValidationErrors = Record<string, string>;

export function parseValidationErrors(error: { issues: { path: readonly PropertyKey[]; message: string }[] }): ValidationErrors {
  const issues: ValidationErrors = {};
  for (const issue of error.issues) {
    const field = issue.path.filter((p): p is string | number => typeof p === "string" || typeof p === "number").join(".") || "form";
    if (!issues[field]) {
      issues[field] = issue.message;
    }
  }
  return issues;
}

export function validateApiRequest<T>(
  schema: ZodType<T>,
  body: unknown,
): { success: true; data: T } | { success: false; response: NextResponse } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const issues = parseValidationErrors(result.error);
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Datos inválidos",
          issues,
        },
        { status: 400 },
      ),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export function validateFormData<T>(
  schema: ZodType<T>,
  values: unknown,
): { success: true; data: T; errors: ValidationErrors } | { success: false; errors: ValidationErrors } {
  const result = schema.safeParse(values);
  if (!result.success) {
    return {
      success: false,
      errors: parseValidationErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
    errors: {},
  };
}

export function validateSingleField<T>(
  schema: ZodType<T>,
  field: string,
  values: unknown,
): string | null {
  const result = schema.safeParse(values);
  if (!result.success) {
    const errors = parseValidationErrors(result.error);
    return errors[field] ?? null;
  }
  return null;
}
