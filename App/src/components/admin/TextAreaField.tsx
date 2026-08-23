"use client";

import type { TextareaHTMLAttributes } from "react";

type TextAreaFieldProps = {
  label: string;
  minHeightClass?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextAreaField({
  label,
  minHeightClass = "min-h-[77px]",
  className = "",
  ...props
}: TextAreaFieldProps) {
  return (
    <label className="block w-full">
      <span className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
        {label}
      </span>
      <textarea
        className={`w-full resize-none border border-ink/10 bg-transparent px-3 py-2 text-[14px] leading-5 text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/30 ${minHeightClass} ${className}`}
        {...props}
      />
    </label>
  );
}
