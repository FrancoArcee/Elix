"use client";

type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function FilterChip({
  label,
  active = false,
  onClick,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-[27px] items-center justify-center px-3 py-1.5 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.35px] transition-colors ${
        active
          ? "border border-ink bg-ink text-background"
          : "border border-ink/10 bg-transparent text-muted hover:border-ink/35 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
