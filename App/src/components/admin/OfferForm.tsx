"use client";

import { useState } from "react";
import AdminButton from "./AdminButton";
import FilterChip from "./FilterChip";
import type { OfferCategory } from "@/context/adminStore";

const CATEGORY_OPTIONS: OfferCategory[] = [
  "Perfumes Árabes",
  "Body Splash",
  "Toda la colección",
];

export type OfferFormValues = {
  discount: string;
  paymentMethod: string;
  categories: OfferCategory[];
  description: string;
};

type OfferFormProps = {
  paymentMethods: { name: string }[];
  initialValues?: OfferFormValues;
  editing?: boolean;
  onSubmit: (values: OfferFormValues) => void;
  onCancel: () => void;
};

const EMPTY_VALUES: OfferFormValues = {
  discount: "",
  paymentMethod: "",
  categories: [],
  description: "",
};

export default function OfferForm({
  paymentMethods,
  initialValues,
  editing = false,
  onSubmit,
  onCancel,
}: OfferFormProps) {
  const [values, setValues] = useState<OfferFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });

  const toggleCategory = (category: OfferCategory) => {
    setValues((current) => {
      if (category === "Toda la colección") {
        return {
          ...current,
          categories: current.categories.includes("Toda la colección")
            ? []
            : ["Toda la colección"],
        };
      }
      let next = current.categories.filter((item) => item !== "Toda la colección");
      next = next.includes(category)
        ? next.filter((item) => item !== category)
        : [...next, category];
      return { ...current, categories: next };
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="flex w-full flex-col items-start border-t border-ink/10 bg-[#eceae6]/40 px-5 py-6"
    >
      <div className="flex w-full flex-col items-start">
        <span className="pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Descuento (%)
        </span>
        <input
          type="number"
          min={1}
          max={100}
          placeholder="Ej: 20"
          value={values.discount}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              discount: event.target.value,
            }))
          }
          className="h-9 w-full border-b border-ink/10 bg-transparent py-2 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/40"
        />
      </div>

      <div className="flex w-full flex-col items-start pt-5">
        <span className="pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Método de pago
        </span>
        <div className="flex h-9 w-full items-center border-b border-ink/10">
          <select
            value={values.paymentMethod}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                paymentMethod: event.target.value,
              }))
            }
            className="h-full w-full appearance-none bg-transparent text-[14px] text-ink outline-none"
          >
            <option value="" disabled>
              Seleccioná un método
            </option>
            {paymentMethods.map((method) => (
              <option key={method.name} value={method.name}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex w-full flex-col items-start pt-5">
        <span className="pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Aplica a
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_OPTIONS.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={values.categories.includes(category)}
              onClick={() => toggleCategory(category)}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-start pt-5">
        <span className="pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Descripción corta
        </span>
        <input
          type="text"
          placeholder="Ej: 20% off pagando en efectivo."
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          className="h-9 w-full border-b border-ink/10 bg-transparent py-2 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/40"
        />
      </div>

      <div className="flex flex-col items-stretch gap-3 pt-6 sm:flex-row sm:items-start">
        <AdminButton
          type="submit"
          variant="primary"
          className="h-[39px] min-w-0 flex-1 py-2.5"
        >
          {editing ? "Guardar cambios" : "Crear oferta"}
        </AdminButton>
        <AdminButton
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-[39px] px-5 py-2.5"
        >
          Cancelar
        </AdminButton>
      </div>
    </form>
  );
}
