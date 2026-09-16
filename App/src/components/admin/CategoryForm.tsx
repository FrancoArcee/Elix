"use client";

import { useState } from "react";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import ColorField from "./ColorField";
import ImageDropzone from "./ImageDropzone";
import AdminButton from "./AdminButton";
import { categorySchema } from "@/schemas/category";
import { validateSingleField, validateFormData, type ValidationErrors } from "@/lib/validation";

export type CategoryFormValues = {
  name: string;
  description: string;
  color: string;
  urlImage: string;
};

type CategoryFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
};

const EMPTY_VALUES: CategoryFormValues = {
  name: "",
  description: "",
  color: "#F2F1EE",
  urlImage: "",
};

export default function CategoryForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof CategoryFormValues, value: string) => {
    setSubmitError(null);
    const next = { ...values, [field]: value };
    setValues(next);
    const fieldError = validateSingleField(categorySchema, field, next);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError ?? "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    const result = validateFormData(categorySchema, values);
    if (!result.success) {
      setErrors(result.errors);
      setSubmitError("Revisá los campos con errores en el formulario.");
      return;
    }
    try {
      await onSubmit({
        ...result.data,
        urlImage: result.data.urlImage ?? "",
      });
    } catch (err: any) {
      setSubmitError(err.message ?? "Error al guardar. Intentá de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[512px]">
      <TextField
        label="Nombre"
        placeholder="Ej: Perfumes Árabes"
        value={values.name}
        error={errors.name}
        onChange={(e) => handleFieldChange("name", e.target.value)}
      />

      <div className="pt-7">
        <TextAreaField
          label="Descripción"
          placeholder="Breve descripción de la categoría"
          value={values.description}
          error={errors.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
        />
      </div>

      <div className="pt-7">
        <ColorField
          label="Color de fondo"
          value={values.color}
          error={errors.color}
          onChange={(color) => handleFieldChange("color", color)}
        />
      </div>

      <div className="pt-7">
        <ImageDropzone
          label="Imagen"
          folder="categories"
          value={values.urlImage}
          onChange={(urlImage) =>
            handleFieldChange("urlImage", urlImage ?? "")
          }
        />
      </div>

      {submitError && (
        <p className="pt-7 text-[11px] leading-[14px] text-red-500">
          {submitError}
        </p>
      )}

      <div className="flex flex-col items-stretch gap-3 pt-3 sm:flex-row sm:items-start">
        <AdminButton
          type="submit"
          variant="primary"
          className="h-[39px] min-w-0 flex-1 px-5 py-3"
        >
          {mode === "create" ? "Crear categoría" : "Guardar cambios"}
        </AdminButton>
        <AdminButton
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-[39px] px-5 py-3"
        >
          Cancelar
        </AdminButton>
      </div>
    </form>
  );
}
