"use client";

import type { ButtonHTMLAttributes } from "react";

type AdminButtonProps = {
  variant?: "primary" | "outline" | "ghost";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANTS = {
  primary:
    "bg-ink text-background hover:bg-ink/85 border border-ink",
  outline:
    "border border-ink/10 bg-transparent text-muted hover:border-ink/35 hover:text-ink",
  ghost: "bg-transparent text-muted hover:text-ink",
};

export default function AdminButton({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
