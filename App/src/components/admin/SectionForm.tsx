"use client";

import { useState } from "react";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import ImageDropzone from "./ImageDropzone";
import AdminButton from "./AdminButton";
import { informationSectionSchema } from "@/schemas/information";
import {
  validateSingleField,
  validateFormData,
  type ValidationErrors,
} from "@/lib/validation";

export type SectionFormValues = {
  label: string;
  title: string;
  description: string;
  imageUrl: string;
};

type SectionFormProps = {
  mode: "create" | "edit";
  initialValues?: SectionFormValues;
  onSubmit: (values: SectionFormValues) => void;
  onCancel: () => void;
};

const EMPTY_VALUES: SectionFormValues = {
  label: "",
  title: "",
  description: "",
  imageUrl: "",
};

export default function SectionForm({
  mode,
  initialValues = EMPTY_VALUES,
  onSubmit,
  onCancel,
}: SectionFormProps) {
  const [values, setValues] = useState<SectionFormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleFieldChange = (field: keyof SectionFormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    const fieldError = validateSingleField(
      informationSectionSchema,
      field,
      next,
    );
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError ?? "",
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = validateFormData(informationSectionSchema, values);
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
        label="Label"
        placeholder="Ej: Quiénes somos"
        value={values.label}
        error={errors.label}
        onChange={(e) => handleFieldChange("label", e.target.value)}
      />

      <div className="pt-7">
        <TextField
          label="Título"
          placeholder="Ej: ELIX nació de la pasión por las fragancias."
          value={values.title}
          error={errors.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
        />
      </div>

      <div className="pt-7">
        <TextAreaField
          label="Descripción"
          placeholder="Texto descriptivo de la sección..."
          minHeightClass="min-h-[97px]"
          value={values.description}
          error={errors.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
        />
      </div>

      <div className="pt-7">
        <ImageDropzone
          label="Imagen"
          optional
          folder="info"
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
          {mode === "create" ? "Crear sección" : "Guardar cambios"}
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
