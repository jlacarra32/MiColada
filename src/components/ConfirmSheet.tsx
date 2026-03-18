"use client";

import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

interface ConfirmSheetProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmSheet({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  tone = "danger",
  onClose,
  onConfirm,
}: ConfirmSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Cerrar confirmacion"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 rounded-t-[32px] border border-white/10 bg-[#07192b] px-5 pb-8 pt-5 shadow-[0_-20px_55px_rgba(0,0,0,0.48)]"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 2rem)" }}
      >
        <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-white/12" />
        <div className="flex items-start gap-3">
          <div
            className={clsx(
              "mt-0.5 rounded-2xl p-3",
              tone === "danger" ? "bg-red-500/14 text-red-300" : "bg-cyan-400/14 text-cyan-200"
            )}
          >
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-300">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm font-semibold text-zinc-100 transition-colors active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={clsx(
              "flex-1 rounded-2xl px-4 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98]",
              tone === "danger"
                ? "bg-red-500 shadow-[0_14px_28px_rgba(239,68,68,0.25)]"
                : "bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_14px_28px_rgba(56,189,248,0.28)]"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
