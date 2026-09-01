"use client";

import { useState } from "react";
import TextField from "./TextField";
import AdminButton from "./AdminButton";

export type InlineFieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  optional?: boolean;
};

type InlineEntryFormProps = {
  title: string;
  fields: InlineFieldConfig[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
};

export default function InlineEntryForm({
  title,
  fields,
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

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="w-full border border-ink/20 bg-background p-4"
    >
      <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.25px] text-muted">
        {title}
      </p>

      <div className="grid grid-cols-1 gap-x-3 gap-y-3 pt-4 sm:grid-cols-2">
        {fields.map((field) => (
          <TextField
            key={field.name}
            compact
            label={field.label}
            tag={field.optional ? "Opcional" : undefined}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                [field.name]: event.target.value,
              }))
            }
          />
        ))}
      </div>

      <div className="flex flex-col items-stretch gap-2 pt-4 sm:flex-row sm:items-start">
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
