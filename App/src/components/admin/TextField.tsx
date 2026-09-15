"use client";

import type { InputHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
  tag?: string;
  compact?: boolean;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextField({
  label,
  tag,
  compact = false,
  error,
  className = "",
  ...props
}: TextFieldProps) {
  return (
    <label className="block w-full">
      <span
        className={`flex items-center ${
          tag ? "gap-2" : ""
        } ${compact ? "pb-1.5" : "pb-2"}`}
      >
        <span
          className={`text-[9px] font-medium uppercase leading-[13.5px] text-ink ${
            compact ? "tracking-[1.8px]" : "tracking-[2.25px]"
          }`}
        >
          {label}
        </span>
        {tag && (
          <span className="border border-ink/10 px-1.5 py-0.5 text-[8px] uppercase leading-3 tracking-[1.2px] text-muted">
            {tag}
          </span>
        )}
      </span>
      <input
        className={`w-full border-b bg-transparent text-[14px] text-ink outline-none transition-colors placeholder:text-muted ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-ink/10 focus:border-ink/40"
        } ${compact ? "h-[33px] py-1.5" : "h-[36px] py-2"} ${className}`}
        {...props}
      />
      {error && (
        <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">{error}</p>
      )}
    </label>
  );
}
