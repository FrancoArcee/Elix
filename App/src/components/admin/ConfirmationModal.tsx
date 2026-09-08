"use client";

import AdminButton from "./AdminButton";

type ConfirmationModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-[400px] border border-ink/10 bg-background p-6">
        <p className="font-serif text-[18px] font-bold leading-6 text-ink">
          {title}
        </p>
        <p className="pt-2 text-[12px] leading-4 text-muted">{message}</p>
        <div className="flex flex-col items-stretch gap-3 pt-6 sm:flex-row">
          <AdminButton
            variant="primary"
            onClick={onConfirm}
            className="h-[39px] flex-1 px-5 py-3"
          >
            {confirmLabel}
          </AdminButton>
          <AdminButton
            variant="outline"
            onClick={onCancel}
            className="h-[39px] flex-1 px-5 py-3"
          >
            {cancelLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}