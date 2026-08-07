"use client";

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
};

export default function FilterPanel({ className }: FilterPanelProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((value) => value !== option)
        : [...prev, option],
    );
  };

  return (
    <aside className={className}>
      {FILTER_GROUPS.map((group, groupIndex) => (
        <div key={group.title} className={groupIndex > 0 ? "pt-8" : undefined}>
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
