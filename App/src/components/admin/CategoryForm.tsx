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
  imageUrl: string;
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
  imageUrl: "",
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

  const handleFieldChange = (field: keyof CategoryFormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    const fieldError = validateSingleField(categorySchema, field, next);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError ?? "",
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = validateFormData(categorySchema, values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    onSubmit({
      ...result.data,
      imageUrl: result.data.imageUrl ?? "",
    });
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
          value={values.imageUrl}
          onChange={(imageUrl) =>
            handleFieldChange("imageUrl", imageUrl ?? "")
          }
        />
      </div>

      <div className="flex flex-col items-stretch gap-3 pt-9 sm:flex-row sm:items-start">
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
