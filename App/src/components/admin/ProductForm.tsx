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
  concentration: string;
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

const CONCENTRATION_OPTIONS: { label: string; value: string }[] = [
  { label: "EDT", value: "edt" },
  { label: "EDP", value: "edp" },
  { label: "EDC", value: "edc" },
  { label: "Extrait", value: "extrait" },
];

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  brandId: "",
  categoryId: "",
  targetAudience: "unisex",
  concentration: "",
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
      className="w-full max-w-[672px]"
    >
      {/* 1. Datos Principales */}
      <section className="border border-ink/10 bg-background p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[2px] text-ink">
            Información del producto
          </h2>
          <span className="text-[8px] uppercase tracking-[1.2px] text-muted">
            Datos principales
          </span>
        </div>

        <div className="space-y-6 pt-5">
          <TextField
            label="Nombre del producto"
            placeholder="Ej: Oud Royale"
            value={values.name}
            onChange={update("name")}
            required
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-[9px] font-medium uppercase tracking-[2px] text-ink">
                  Marca
                </span>
                <button
                  type="button"
                  onClick={() => setShowBrandModal(true)}
                  className="text-[9px] font-medium uppercase tracking-[1px] text-muted transition-colors hover:text-ink"
                >
                  + Nueva marca
                </button>
              </div>
              <div className="relative">
                <select
                  value={values.brandId}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      brandId: event.target.value,
                    }))
                  }
                  required
                  className="h-9 w-full appearance-none border-b border-ink/10 bg-transparent pr-8 text-[14px] text-ink outline-none transition-colors focus:border-ink/40"
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
                <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-muted">
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <span className="block pb-2 text-[9px] font-medium uppercase tracking-[2px] text-ink">
                Categoría
              </span>
              <div className="flex flex-wrap gap-1.5">
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
          </div>

          <div className="grid grid-cols-1 gap-5 pt-1 sm:grid-cols-2">
            <div>
              <span className="block pb-2 text-[9px] font-medium uppercase tracking-[2px] text-ink">
                Orientación
              </span>
              <div className="flex flex-wrap gap-1.5">
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

            <div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-[9px] font-medium uppercase tracking-[2px] text-ink">
                  Concentración
                </span>
                <span className="text-[8px] uppercase tracking-[1px] text-muted">
                  Opcional
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CONCENTRATION_OPTIONS.map((c) => (
                  <FilterChip
                    key={c.value}
                    label={c.label}
                    active={values.concentration === c.value}
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        concentration:
                          current.concentration === c.value ? "" : c.value,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-1">
            <TextField
              label="Familia olfativa"
              tag="Opcional"
              placeholder="Ej: Amaderado Oriental, Floral Especiado"
              value={values.olfactoryFamily}
              onChange={update("olfactoryFamily")}
            />
          </div>
        </div>
      </section>

      {/* 2. Precios y Presentación */}
      <section className="mt-6 border border-ink/10 bg-background p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[2px] text-ink">
            Comercial y Presentación
          </h2>
          <span className="text-[8px] uppercase tracking-[1.2px] text-muted">
            Precios, tamaños e imágenes
          </span>
        </div>

        <div className="space-y-6 pt-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="Precio de venta ($)"
              tag="Opcional"
              type="number"
              placeholder="Ej: 8900"
              value={values.price}
              onChange={update("price")}
            />
            <TextField
              label="Precio tachado / original ($)"
              tag="Opcional"
              type="number"
              placeholder="Ej: 10500"
              value={values.originalPrice}
              onChange={update("originalPrice")}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <TextField
                label="Tamaños disponibles"
                tag="Opcional"
                placeholder="Ej: 30ml, 50ml, 100ml"
                value={values.sizes}
                onChange={update("sizes")}
              />
              <p className="pt-1 text-[8px] tracking-[0.5px] text-muted">
                Valores separados por coma
              </p>
            </div>

            <div>
              <TextField
                label="Badge / Etiqueta destacada"
                tag="Opcional"
                placeholder="Ej: Nuevo, Más vendido, Oferta"
                value={values.badge}
                onChange={update("badge")}
              />
              <p className="pt-1 text-[8px] tracking-[0.5px] text-muted">
                Etiqueta visible sobre la tarjeta
              </p>
            </div>
          </div>

          <div className="border-t border-ink/[0.06] pt-5">
            <ProductImagesField
              images={values.images}
              onChange={(images) =>
                setValues((current) => ({ ...current, images }))
              }
            />
          </div>
        </div>
      </section>

      {/* 3. Pirámide Olfativa */}
      <section className="mt-6 border border-ink/10 bg-background p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[2px] text-ink">
            Pirámide Olfativa
          </h2>
          <span className="text-[8px] uppercase tracking-[1.2px] text-muted">
            Separar notas con coma
          </span>
        </div>

        <div className="pt-5">
          {isBodySplash ? (
            <TextField
              label="Notas olfativas"
              tag="Opcional"
              placeholder="Ej: Vainilla, Coco, Ámbar"
              value={values.topNotes}
              onChange={update("topNotes")}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <TextField
                label="Notas de salida"
                tag="Opcional"
                placeholder="Ej: Bergamota, Cardamomo"
                value={values.topNotes}
                onChange={update("topNotes")}
              />
              <TextField
                label="Notas de corazón"
                tag="Opcional"
                placeholder="Ej: Oud, Rosa de Damasco"
                value={values.heartNotes}
                onChange={update("heartNotes")}
              />
              <TextField
                label="Notas de fondo"
                tag="Opcional"
                placeholder="Ej: Almizcle, Ámbar gris"
                value={values.baseNotes}
                onChange={update("baseNotes")}
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. Descripción */}
      <section className="mt-6 border border-ink/10 bg-background p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[2px] text-ink">
            Descripción
          </h2>
          <span className="text-[8px] uppercase tracking-[1.2px] text-muted">
            Opcional
          </span>
        </div>

        <div className="pt-5">
          <TextAreaField
            label="Detalles de la fragancia"
            placeholder="Escribí una descripción envolvente sobre el aroma, acordes principales, longevidad o inspiración del perfume..."
            minHeightClass="min-h-[110px]"
            value={values.description}
            onChange={update("description")}
          />
        </div>
      </section>

      {/* Botones de acción */}
      <div className="flex flex-col-reverse items-stretch gap-3 pt-8 pb-14 sm:flex-row sm:justify-end">
        <AdminButton
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-[42px] px-6 text-[10px] tracking-[1.5px]"
        >
          Cancelar
        </AdminButton>
        <AdminButton
          type="submit"
          variant="primary"
          className="h-[42px] px-8 text-[10px] tracking-[1.5px]"
        >
          {mode === "create" ? "Crear producto" : "Guardar cambios"}
        </AdminButton>
      </div>

      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="w-full max-w-[400px] border border-ink/10 bg-background p-6 shadow-2xl">
            <p className="font-serif text-[18px] font-bold leading-6 text-ink">
              Nueva marca
            </p>
            <p className="pt-2 text-[12px] leading-4 text-muted">
              Ingresá el nombre de la nueva marca para incorporarla al catálogo.
            </p>
            <div className="pt-4">
              <TextField
                label="Nombre de la marca"
                placeholder="Ej: Lattafa, Maison Alhambra"
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
