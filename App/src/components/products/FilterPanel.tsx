"use client";

import Image from "next/image";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterGroup = {
  id: "brand" | "targetAudience" | "fraganceFamily" | "concentration";
  title: string;
  options: FilterOption[];
};

export type SelectedFilters = {
  brand: string[];
  targetAudience: string[];
  fraganceFamily: string[];
  concentration: string[];
};

type FilterPanelProps = {
  filterGroups: FilterGroup[];
  selectedFilters: SelectedFilters;
  onToggleFilter: (groupId: keyof SelectedFilters, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
  onClose?: () => void;
};

export default function FilterPanel({
  filterGroups,
  selectedFilters,
  onToggleFilter,
  onClearFilters,
  hasActiveFilters,
  className,
  onClose,
}: FilterPanelProps) {
  return (
    <aside
      className={`max-h-[75vh] overflow-y-auto border border-ink/10 bg-ink/[0.02] p-5 backdrop-blur-xs lg:max-h-none lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between border-b border-ink/10 pb-4 lg:hidden">
        <p className="text-[10px] font-medium uppercase tracking-[2px] text-ink">
          Filtros
        </p>
        {onClose && (
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={onClose}
            className="flex items-center justify-center p-1 transition-opacity hover:opacity-70"
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

      {hasActiveFilters && (
        <div className="flex items-center justify-between border-b border-ink/10 py-3 lg:border-b-0 lg:pb-4 lg:pt-0">
          <span className="text-[11px] text-muted">Filtros activos</span>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[11px] font-medium text-ink underline underline-offset-2 transition-opacity hover:opacity-65"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {filterGroups.map((group, groupIndex) => (
        <div
          key={group.id}
          className={groupIndex > 0 ? "pt-7" : "pt-4 lg:pt-0"}
        >
          <p className="text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
            {group.title}
          </p>
          <div className="pt-3">
            {group.options.map((option, optionIndex) => {
              const isChecked = selectedFilters[group.id].includes(option.value);
              return (
                <label
                  key={option.value}
                  className={
                    optionIndex === 0
                      ? "flex cursor-pointer items-center gap-3 py-[3px]"
                      : "flex cursor-pointer items-center gap-3 pb-[3px] pt-[6px]"
                  }
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleFilter(group.id, option.value)}
                    className="size-4 shrink-0 cursor-pointer appearance-none border border-ink/25 bg-transparent transition-colors checked:border-ink checked:bg-ink focus:outline-none"
                  />
                  <span
                    className={`text-[13px] leading-5 transition-colors ${
                      isChecked
                        ? "font-semibold text-ink"
                        : "font-normal text-muted hover:text-ink"
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
