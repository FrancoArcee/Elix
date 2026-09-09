"use client";

import { useState } from "react";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import AdminButton from "./AdminButton";
import FilterChip from "./FilterChip";
import ProductImagesField from "./ProductImagesField";
import type { ProductOrientation } from "@/context/adminStore";

export type ProductFormValues = {
  name: string;
  brandId: string;
  categoryId: string;
  targetAudience: string;
  olfactoryFamily: string;
  price: string;
  originalPrice: string;
  images: string[];
  sizes: string;
  badge: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  description: string;
};

type ProductFormProps = {
  mode: "create" | "edit";
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  onBrandCreated?: (brand: { id: string; name: string }) => void;
};

const ORIENTATION_OPTIONS: ProductOrientation[] = [
  "Unisex",
  "Masculino",
  "Femenino",
];

const ORIENTATION_MAP: Record<ProductOrientation, string> = {
  Unisex: "unisex",
  Masculino: "masculino",
  Femenino: "femenino",
};

const ORIENTATION_REVERSE: Record<string, ProductOrientation> = {
  unisex: "Unisex",
  masculino: "Masculino",
  femenino: "Femenino",
};

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  brandId: "",
  categoryId: "",
  targetAudience: "unisex",
  olfactoryFamily: "",
  price: "",
  originalPrice: "",
  images: [],
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
  categories,
  initialValues,
  onSubmit,
  onCancel,
  onBrandCreated,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [brandError, setBrandError] = useState<string | null>(null);

  const currentOrientation: ProductOrientation =
    ORIENTATION_REVERSE[values.targetAudience] ?? "Unisex";

  const isBodySplash = categories
    .find((c) => c.id === values.categoryId)
    ?.name.toLowerCase()
    .includes("body splash") ?? false;

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
            value={values.brandId}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                brandId: event.target.value,
              }))
            }
            className="h-9 min-w-0 flex-1 appearance-none border-b border-ink/10 bg-transparent text-[14px] text-ink outline-none transition-colors focus:border-ink/40"
          >
            <option value="" disabled>
              Seleccioná una marca
            </option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-label="Agregar marca"
            onClick={() => setShowBrandModal(true)}
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
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              label={category.name}
              active={values.categoryId === category.id}
              onClick={() =>
                setValues((current) => ({ ...current, categoryId: category.id }))
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
              active={currentOrientation === orientation}
              onClick={() =>
                setValues((current) => ({
                  ...current,
                  targetAudience: ORIENTATION_MAP[orientation],
                }))
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
        <ProductImagesField
          images={values.images}
          onChange={(images) =>
            setValues((current) => ({ ...current, images }))
          }
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

      {isBodySplash ? (
        <div className="pt-6">
          <TextField
            label="Nota"
            tag="Opcional"
            placeholder="Ej: Vainilla"
            value={values.topNotes}
            onChange={update("topNotes")}
          />
        </div>
      ) : (
        <>
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
        </>
      )}

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

      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[400px] border border-ink/10 bg-background p-6">
            <p className="font-serif text-[18px] font-bold leading-6 text-ink">
              Nueva marca
            </p>
            <p className="pt-2 text-[12px] leading-4 text-muted">
              Ingresá el nombre de la nueva marca.
            </p>
            <div className="pt-4">
              <TextField
                label="Nombre"
                placeholder="Ej: Nueva Marca"
                value={newBrandName}
                onChange={(e) => {
                  setNewBrandName(e.target.value);
                  setBrandError(null);
                }}
              />
              {brandError && (
                <p className="pt-1 text-[11px] leading-4 text-red-700">
                  {brandError}
                </p>
              )}
            </div>
            <div className="flex flex-col items-stretch gap-3 pt-6 sm:flex-row">
              <AdminButton
                variant="primary"
                onClick={async () => {
                  if (!newBrandName.trim()) {
                    setBrandError("El nombre es requerido.");
                    return;
                  }
                  try {
                    const { createBrand } = await import("@/services/brands");
                    const created = await createBrand({ name: newBrandName.trim() });
                    onBrandCreated?.({ id: created.id, name: created.name });
                    setValues((current) => ({ ...current, brandId: created.id }));
                    setNewBrandName("");
                    setShowBrandModal(false);
                  } catch {
                    setBrandError("No se pudo crear la marca. Puede que ya exista.");
                  }
                }}
                className="h-[39px] flex-1 px-5 py-3"
              >
                Crear
              </AdminButton>
              <AdminButton
                variant="outline"
                onClick={() => {
                  setShowBrandModal(false);
                  setNewBrandName("");
                  setBrandError(null);
                }}
                className="h-[39px] flex-1 px-5 py-3"
              >
                Cancelar
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
