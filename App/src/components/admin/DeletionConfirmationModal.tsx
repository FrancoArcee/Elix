"use client";

import { useState } from "react";
import AdminButton from "./AdminButton";

type DeletionConfirmationModalProps = {
  title: string;
  entityName: string;
  message: string;
  products: { name: string; brand: string }[];
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeletionConfirmationModal({
  title,
  entityName,
  message,
  products,
  onConfirm,
  onCancel,
}: DeletionConfirmationModalProps) {
  const [input, setInput] = useState("");
  const canConfirm = input.trim() === entityName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-[400px] border border-ink/10 bg-background p-6">
        <p className="font-serif text-[18px] font-bold leading-6 text-ink">
          {title}
        </p>
        <p className="pt-2 text-[12px] leading-4 text-muted">{message}</p>

        {products.length > 0 && (
          <div className="pt-4">
            <p className="text-[11px] font-medium uppercase tracking-[1.2px] text-ink">
              {products.length} producto(s) serán eliminados:
            </p>
            <ul className="mt-2 max-h-[200px] overflow-y-auto border border-ink/10 p-3 text-[12px] leading-4 text-muted">
              {products.map((p, i) => (
                <li key={i} className="py-1">
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="ml-1">— {p.brand}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4">
          <label className="block w-full">
            <span className="pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink">
              Escribí &quot;{entityName}&quot; para confirmar
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-[36px] w-full border-b border-ink/10 bg-transparent py-2 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/40"
              placeholder={entityName}
            />
          </label>
        </div>

        <div className="flex flex-col items-stretch gap-3 pt-6 sm:flex-row">
          <AdminButton
            variant="primary"
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`h-[39px] flex-1 px-5 py-3 ${!canConfirm ? "cursor-not-allowed opacity-40" : ""}`}
          >
            Eliminar
          </AdminButton>
          <AdminButton
            variant="outline"
            onClick={onCancel}
            className="h-[39px] flex-1 px-5 py-3"
          >
            Cancelar
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
