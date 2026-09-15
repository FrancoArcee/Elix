"use client";

import { useState } from "react";
import AdminButton from "./AdminButton";
import FilterChip from "./FilterChip";
import { offerFormSchema } from "@/schemas/offer";
import {
  validateSingleField,
  validateFormData,
  type ValidationErrors,
} from "@/lib/validation";

export type OfferFormValues = {
  discount: string;
  paymentMethod: string;
  categories: string[];
  description: string;
};

type OfferFormProps = {
  paymentMethods: { name: string }[];
  categories: { name: string }[];
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
  categories,
  initialValues,
  editing = false,
  onSubmit,
  onCancel,
}: OfferFormProps) {
  const categoryOptions = [
    ...categories.map((c) => c.name),
    "Toda la colección",
  ];
  const [values, setValues] = useState<OfferFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleFieldChange = (field: keyof OfferFormValues, value: any) => {
    const next = { ...values, [field]: value };
    setValues(next);
    const fieldError = validateSingleField(offerFormSchema, field, next);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError ?? "",
    }));
  };

  const toggleCategory = (category: string) => {
    let nextCategories: string[];
    if (category === "Toda la colección") {
      nextCategories = values.categories.includes("Toda la colección")
        ? []
        : ["Toda la colección"];
    } else {
      let filtered = values.categories.filter(
        (item) => item !== "Toda la colección",
      );
      filtered = filtered.includes(category)
        ? filtered.filter((item) => item !== category)
        : [...filtered, category];
      nextCategories = filtered;
    }

    handleFieldChange("categories", nextCategories);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = validateFormData(offerFormSchema, values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
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
            handleFieldChange("discount", event.target.value)
          }
          className={`h-9 w-full border-b bg-transparent py-2 text-[14px] text-ink outline-none transition-colors placeholder:text-muted ${
            errors.discount
              ? "border-red-500 focus:border-red-500"
              : "border-ink/10 focus:border-ink/40"
          }`}
        />
        {errors.discount && (
          <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">
            {errors.discount}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col items-start pt-5">
        <span className="pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Método de pago
        </span>
        <div
          className={`flex h-9 w-full items-center border-b ${
            errors.paymentMethod ? "border-red-500" : "border-ink/10"
          }`}
        >
          <select
            value={values.paymentMethod}
            onChange={(event) =>
              handleFieldChange("paymentMethod", event.target.value)
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
        {errors.paymentMethod && (
          <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">
            {errors.paymentMethod}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col items-start pt-5">
        <span className="pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Aplica a
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {categoryOptions.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={values.categories.includes(category)}
              onClick={() => toggleCategory(category)}
            />
          ))}
        </div>
        {errors.categories && (
          <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">
            {errors.categories}
          </p>
        )}
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
            handleFieldChange("description", event.target.value)
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
