"use client";

type ColorFieldProps = {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function ColorField({
  label,
  value,
  error,
  onChange,
}: ColorFieldProps) {
  return (
    <div className="w-full">
      <span className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
        {label}
      </span>
      <div className="flex h-[52px] items-center gap-4 pt-3">
        <input
          type="color"
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-10 shrink-0 cursor-pointer appearance-none border border-ink/10 bg-transparent p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0"
        />
        <span className="shrink-0 font-mono text-[12px] uppercase leading-4 text-muted">
          {value.toUpperCase()}
        </span>
        <span
          className="h-8 min-w-0 flex-1 border border-ink/10"
          style={{ backgroundColor: value }}
        />
      </div>
      {error && (
        <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">{error}</p>
      )}
    </div>
  );
}
