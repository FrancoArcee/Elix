"use client";

import { useState } from "react";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import ImageDropzone from "./ImageDropzone";
import AdminButton from "./AdminButton";

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

  const update =
    (field: keyof SectionFormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="w-full max-w-[512px]"
    >
      <TextField
        label="Label"
        placeholder="Ej: Quiénes somos"
        value={values.label}
        onChange={update("label")}
      />

      <div className="pt-7">
        <TextField
          label="Título"
          placeholder="Ej: ELIX nació de la pasión por las fragancias."
          value={values.title}
          onChange={update("title")}
        />
      </div>

      <div className="pt-7">
        <TextAreaField
          label="Descripción"
          placeholder="Texto descriptivo de la sección..."
          minHeightClass="min-h-[97px]"
          value={values.description}
          onChange={update("description")}
        />
      </div>

      <div className="pt-7">
        <ImageDropzone
          label="Imagen"
          optional
          value={values.imageUrl}
          onChange={(imageUrl) =>
            setValues((current) => ({ ...current, imageUrl: imageUrl ?? "" }))
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
