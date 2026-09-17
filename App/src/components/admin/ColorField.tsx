"use client";

import { useEffect, useState } from "react";

type ColorFieldProps = {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

function normalizeToHex(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "#000000";
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (/^#([0-9a-fA-F]{6})$/.test(withHash)) {
    return withHash.toLowerCase();
  }
  if (/^#([0-9a-fA-F]{3})$/.test(withHash)) {
    const [r, g, b] = withHash.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return "#000000";
}

export default function ColorField({
  label,
  value,
  error,
  onChange,
}: ColorFieldProps) {
  const [textValue, setTextValue] = useState(value || "#F2F1EE");

  useEffect(() => {
    setTextValue(value || "");
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    if (raw && !raw.startsWith("#")) {
      raw = `#${raw}`;
    }
    setTextValue(raw);
    onChange(raw);
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextColor = e.target.value.toUpperCase();
    setTextValue(nextColor);
    onChange(nextColor);
  };

  const pickerValue = normalizeToHex(value);

  return (
    <div className="w-full">
      <span className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
        {label}
      </span>
      <div className="flex h-[52px] items-center gap-4 pt-3">
        <label
          className="relative flex size-10 shrink-0 cursor-pointer items-center justify-center border border-ink/10 transition-transform active:scale-95"
          style={{ backgroundColor: pickerValue }}
          title="Seleccionar color"
        >
          <input
            type="color"
            aria-label={label}
            value={pickerValue}
            onChange={handlePickerChange}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>

        <div className="flex items-center">
          <input
            type="text"
            value={textValue}
            onChange={handleTextChange}
            maxLength={7}
            placeholder="#F2F1EE"
            className="w-24 border-b border-ink/10 bg-transparent py-1 font-mono text-[13px] uppercase text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/40"
          />
        </div>

        <span
          className="h-8 min-w-0 flex-1 border border-ink/10 transition-colors"
          style={{ backgroundColor: value }}
        />
      </div>
      {error && (
        <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">{error}</p>
      )}
    </div>
  );
}
