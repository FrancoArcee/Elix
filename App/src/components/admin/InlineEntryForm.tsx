"use client";

import { useState } from "react";
import type { ZodType } from "zod";
import TextField from "./TextField";
import AdminButton from "./AdminButton";
import {
  validateSingleField,
  validateFormData,
  type ValidationErrors,
} from "@/lib/validation";

export type InlineFieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  optional?: boolean;
  type?: "text" | "select";
  options?: string[];
};

type InlineEntryFormProps = {
  title: string;
  fields: InlineFieldConfig[];
  schema?: ZodType<any>;
  initialValues?: Record<string, string>;
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
};

export default function InlineEntryForm({
  title,
  fields,
  schema,
  initialValues,
  submitLabel = "Guardar",
  onSubmit,
  onCancel,
}: InlineEntryFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of fields) {
      initial[field.name] = initialValues?.[field.name] ?? "";
    }
    return initial;
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = (fieldName: string, value: string) => {
    setSubmitError(null);
    const next = { ...values, [fieldName]: value };
    setValues(next);
    if (schema) {
      const err = validateSingleField(schema, fieldName, next);
      setErrors((prev) => ({ ...prev, [fieldName]: err ?? "" }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    if (schema) {
      const result = validateFormData(schema, values);
      if (!result.success) {
        setErrors(result.errors);
        setSubmitError("Revisá los campos con errores en el formulario.");
        return;
      }
    }
    try {
      await onSubmit(values);
    } catch (err: any) {
      setSubmitError(err.message ?? "Error al guardar. Intentá de nuevo.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full border border-ink/20 bg-background p-4"
    >
      <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.25px] text-muted">
        {title}
      </p>

      <div className="grid grid-cols-1 gap-x-3 gap-y-3 pt-4 sm:grid-cols-2">
        {fields.map((field) =>
          field.type === "select" ? (
            <label key={field.name} className="block w-full">
              <span
                className={`flex items-center ${
                  field.optional ? "gap-2" : ""
                } pb-1.5`}
              >
                <span className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.8px] text-ink">
                  {field.label}
                </span>
                {field.optional && (
                  <span className="border border-ink/10 px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[1.2px] text-muted">
                    Opcional
                  </span>
                )}
              </span>
              <select
                className={`h-[33px] w-full appearance-none border-b bg-transparent py-1.5 text-[14px] text-ink outline-none transition-colors ${
                  errors[field.name]
                    ? "border-red-500 focus:border-red-500"
                    : "border-ink/10 focus:border-ink/40"
                }`}
                value={values[field.name]}
                onChange={(event) =>
                  handleFieldChange(field.name, event.target.value)
                }
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors[field.name] && (
                <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">
                  {errors[field.name]}
                </p>
              )}
            </label>
          ) : (
            <TextField
              key={field.name}
              compact
              label={field.label}
              tag={field.optional ? "Opcional" : undefined}
              placeholder={field.placeholder}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={(event) =>
                handleFieldChange(field.name, event.target.value)
              }
            />
          ),
        )}
      </div>

      {submitError && (
        <p className="pt-4 text-[11px] leading-[14px] text-red-500">
          {submitError}
        </p>
      )}

      <div className="flex flex-col items-stretch gap-2 pt-2 sm:flex-row sm:items-start">
        <AdminButton
          type="submit"
          variant="primary"
          className="h-[31px] min-w-0 flex-1 px-4 py-2"
        >
          {submitLabel}
        </AdminButton>
        <AdminButton
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-[31px] px-4 py-2"
        >
          Cancelar
        </AdminButton>
      </div>
    </form>
  );
}
