"use client";

import Image from "next/image";
import { useState } from "react";

type FilterGroup = {
  title: string;
  options: string[];
};

const FILTER_GROUPS: FilterGroup[] = [
  {
    title: "Marca",
    options: [
      "Lattafa",
      "Swiss Arabian",
      "Maison Alhambra",
      "Ajmal",
      "Al Haramain",
      "Rasasi",
      "ELIX Collection",
    ],
  },
  {
    title: "Género",
    options: ["Masculino", "Femenino", "Unisex"],
  },
  {
    title: "Familia Olfativa",
    options: [
      "Amaderado Oriental",
      "Floral",
      "Oriental Ambarado",
      "Floral Frutal",
      "Amaderado Especiado",
    ],
  },
  {
    title: "Disponibilidad",
    options: ["Con stock"],
  },
];

type FilterPanelProps = {
  className?: string;
  onClose?: () => void;
};

export default function FilterPanel({ className, onClose }: FilterPanelProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((value) => value !== option)
        : [...prev, option],
    );
  };

  return (
    <aside
      className={`max-h-[70vh] overflow-y-auto border border-ink/10 p-6 lg:max-h-none lg:overflow-visible lg:border-0 lg:p-0 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between lg:hidden">
        <p className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
          Filtros
        </p>
        {onClose && (
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={onClose}
            className="flex items-center justify-center"
          >
            <Image
              src="/icons/icon-close.svg"
              alt=""
              width={15}
              height={15}
              className="size-[15px]"
            />
          </button>
        )}
      </div>
      {FILTER_GROUPS.map((group, groupIndex) => (
        <div key={group.title} className={groupIndex > 0 ? "pt-8" : "pt-6 lg:pt-0"}>
          <p className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
            {group.title}
          </p>
          <div className="pt-4">
            {group.options.map((option, optionIndex) => (
              <label
                key={option}
                className={
                  optionIndex === 0
                    ? "flex cursor-pointer items-center gap-3 py-[2px]"
                    : "flex cursor-pointer items-center gap-3 pb-[2px] pt-[6px]"
                }
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggle(option)}
                  className="size-4 shrink-0 cursor-pointer appearance-none border-[0.667px] border-ink/10 bg-transparent checked:bg-ink"
                />
                <span className="text-[14px] font-medium leading-5 text-muted">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
