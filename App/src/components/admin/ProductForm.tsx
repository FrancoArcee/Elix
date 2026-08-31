"use client";

import { useState } from "react";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import AdminButton from "./AdminButton";
import FilterChip from "./FilterChip";
import type {
  ProductCategory,
  ProductOrientation,
} from "@/context/adminStore";

export type ProductFormValues = {
  name: string;
  brand: string;
  category: ProductCategory;
  orientation: ProductOrientation;
  olfactoryFamily: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  sizes: string;
  badge: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  description: string;
};

type ProductFormProps = {
  mode: "create" | "edit";
  brands: { name: string }[];
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
};

const CATEGORY_OPTIONS: ProductCategory[] = [
  "Perfumes Árabes",
  "Body Splash",
];

const ORIENTATION_OPTIONS: ProductOrientation[] = [
  "Unisex",
  "Masculino",
  "Femenino",
];

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  brand: "",
  category: "Perfumes Árabes",
  orientation: "Unisex",
  olfactoryFamily: "",
  price: "",
  originalPrice: "",
  imageUrl: "",
  sizes: "",
  badge: "",
  topNotes: "",
  heartNotes: "",
  baseNotes: "",
  description: "",
};

export default function ProductForm({
  mode,
  brands,
  initialValues,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });

  const update =
    (field: keyof ProductFormValues) =>
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
      <h2 className="border-b border-ink/10 pb-2 text-[9px] font-normal uppercase leading-[13.5px] tracking-[2.7px] text-muted">
        Identificación
      </h2>

      <div className="pt-6">
        <TextField
          label="Nombre"
          placeholder="Ej: Oud Royale"
          value={values.name}
          onChange={update("name")}
        />
      </div>

      <div className="pt-6">
        <span className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Marca
        </span>
        <div className="flex items-center gap-2">
          <select
            value={values.brand}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                brand: event.target.value,
              }))
            }
            className="h-9 min-w-0 flex-1 appearance-none border-b border-ink/10 bg-transparent text-[14px] text-ink outline-none transition-colors focus:border-ink/40"
          >
            <option value="" disabled>
              Seleccioná una marca
            </option>
            {brands.map((brand) => (
              <option key={brand.name} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-label="Agregar marca"
            className="flex size-8 shrink-0 items-center justify-center border border-ink/10 text-[18px] font-medium leading-[18px] text-muted transition-colors hover:border-ink/35 hover:text-ink"
          >
            +
          </button>
        </div>
      </div>

      <div className="pt-6">
        <span className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Categoría
        </span>
        <div className="flex flex-wrap items-start gap-2">
          {CATEGORY_OPTIONS.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={values.category === category}
              onClick={() =>
                setValues((current) => ({ ...current, category }))
              }
            />
          ))}
        </div>
      </div>

      <div className="pt-6">
        <span className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Orientación
        </span>
        <div className="flex flex-wrap items-start gap-2">
          {ORIENTATION_OPTIONS.map((orientation) => (
            <FilterChip
              key={orientation}
              label={orientation}
              active={values.orientation === orientation}
              onClick={() =>
                setValues((current) => ({ ...current, orientation }))
              }
            />
          ))}
        </div>
      </div>

      <div className="pt-6">
        <TextField
          label="Familia olfativa"
          tag="Opcional"
          placeholder="Ej: Amaderado Oriental"
          value={values.olfactoryFamily}
          onChange={update("olfactoryFamily")}
        />
      </div>

      <h2 className="mt-8 border-b border-ink/10 pb-2 text-[9px] font-normal uppercase leading-[13.5px] tracking-[2.7px] text-muted">
        Precio
      </h2>

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 pt-6 sm:grid-cols-2">
        <TextField
          label="Precio"
          tag="Opcional"
          type="number"
          placeholder="Ej: 8900"
          value={values.price}
          onChange={update("price")}
        />
        <TextField
          label="Precio original"
          tag="Opcional"
          type="number"
          placeholder="Ej: 10500"
          value={values.originalPrice}
          onChange={update("originalPrice")}
        />
      </div>

      <h2 className="mt-8 border-b border-ink/10 pb-2 text-[9px] font-normal uppercase leading-[13.5px] tracking-[2.7px] text-muted">
        Presentación
      </h2>

      <div className="pt-6">
        <TextField
          label="URL de imagen"
          placeholder="https://..."
          value={values.imageUrl}
          onChange={update("imageUrl")}
        />
      </div>

      <div className="pt-6">
        <TextField
          label="Tamaños disponibles"
          placeholder="30ml, 50ml, 100ml"
          value={values.sizes}
          onChange={update("sizes")}
        />
        <p className="pt-1 text-[9px] leading-[13.5px] text-muted">
          Separados por coma.
        </p>
      </div>

      <div className="pt-6">
        <TextField
          label="Badge"
          tag="Opcional"
          placeholder="Ej: Nuevo, Más vendido"
          value={values.badge}
          onChange={update("badge")}
        />
      </div>

      <h2 className="mt-8 border-b border-ink/10 pb-2 text-[9px] font-normal uppercase leading-[13.5px] tracking-[2.7px] text-muted">
        Notas olfativas
      </h2>

      <p className="pt-4 text-[9px] leading-[13.5px] text-muted">
        Ingresá las notas separadas por coma.
      </p>

      <div className="pt-6">
        <TextField
          label="Notas de salida"
          tag="Opcional"
          placeholder="Ej: Bergamota, Cardamomo"
          value={values.topNotes}
          onChange={update("topNotes")}
        />
      </div>

      <div className="pt-6">
        <TextField
          label="Notas de corazón"
          tag="Opcional"
          placeholder="Ej: Oud, Rosa de Damasco"
          value={values.heartNotes}
          onChange={update("heartNotes")}
        />
      </div>

      <div className="pt-6">
        <TextField
          label="Notas de fondo"
          tag="Opcional"
          placeholder="Ej: Almizcle, Ámbar gris"
          value={values.baseNotes}
          onChange={update("baseNotes")}
        />
      </div>

      <h2 className="mt-8 border-b border-ink/10 pb-2 text-[9px] font-normal uppercase leading-[13.5px] tracking-[2.7px] text-muted">
        Descripción
      </h2>

      <div className="pt-6">
        <TextAreaField
          label="Descripción del producto"
          placeholder="Descripción del producto..."
          minHeightClass="min-h-[97px]"
          value={values.description}
          onChange={update("description")}
        />
      </div>

      <div className="flex flex-col items-stretch gap-3 pb-8 pt-10 sm:flex-row sm:items-start">
        <AdminButton
          type="submit"
          variant="primary"
          className="h-[39px] min-w-0 flex-1 px-5 py-3"
        >
          {mode === "create" ? "Crear producto" : "Guardar cambios"}
        </AdminButton>
        <AdminButton
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-[39px] px-5 py-3 sm:min-w-0"
        >
          Cancelar
        </AdminButton>
      </div>
    </form>
  );
}
