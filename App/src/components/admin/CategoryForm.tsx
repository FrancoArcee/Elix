"use client";

import { useState } from "react";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import ColorField from "./ColorField";
import ImageDropzone from "./ImageDropzone";
import AdminButton from "./AdminButton";

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

  const update =
    (field: keyof CategoryFormValues) =>
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
        label="Nombre"
        placeholder="Ej: Perfumes Árabes"
        value={values.name}
        onChange={update("name")}
      />

      <div className="pt-7">
        <TextAreaField
          label="Descripción"
          placeholder="Breve descripción de la categoría"
          value={values.description}
          onChange={update("description")}
        />
      </div>

      <div className="pt-7">
        <ColorField
          label="Color de fondo"
          value={values.color}
          onChange={(color) => setValues((current) => ({ ...current, color }))}
        />
      </div>

      <div className="pt-7">
        <ImageDropzone
          label="Imagen"
          folder="categories"
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
