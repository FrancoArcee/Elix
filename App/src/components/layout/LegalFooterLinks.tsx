"use client";

import { useLegalStore } from "@/context/useLegalStore";

export default function LegalFooterLinks() {
  const openModal = useLegalStore((state) => state.openModal);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={() => openModal("terminos")}
        className="text-[12px] text-background/35 transition-colors hover:text-background/70"
      >
        Términos y condiciones
      </button>
      <button
        type="button"
        onClick={() => openModal("privacidad")}
        className="text-[12px] text-background/35 transition-colors hover:text-background/70"
      >
        Política de privacidad
      </button>
    </div>
  );
}
