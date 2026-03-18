"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Toast({
  message,
  visible,
  onClose,
  duration = 3000,
  icon,
  actionLabel,
  onAction,
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const frame = requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 280);
    }, duration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-28 left-1/2 z-[100] w-[90%] max-w-sm -translate-x-1/2 transition-all duration-300 ease-out ${
        show ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-[#081a2e]/95 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="shrink-0 rounded-full bg-emerald-500/18 p-1.5">
          {icon || <CheckCircle2 size={18} className="text-emerald-400" />}
        </div>
        <p className="flex-1 text-sm font-medium text-white">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={() => {
              onAction();
              setShow(false);
              setTimeout(onClose, 220);
            }}
            className="rounded-full bg-cyan-400/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-200 transition-colors active:scale-95"
          >
            {actionLabel}
          </button>
        )}
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 280);
          }}
          className="shrink-0 rounded-full p-1 text-zinc-500 transition-colors active:scale-90 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
