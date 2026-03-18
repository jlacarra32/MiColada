"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  icon?: React.ReactNode;
}

export default function Toast({ message, visible, onClose, duration = 3000, icon }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      // Small delay for mount animation
      requestAnimationFrame(() => setShow(true));
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] transition-all duration-300 ease-out ${
        show
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95"
      }`}
    >
      <div className="bg-zinc-800/95 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl shadow-black/40 flex items-center gap-3">
        <div className="bg-emerald-500/20 p-1.5 rounded-full shrink-0">
          {icon || <CheckCircle2 size={18} className="text-emerald-400" />}
        </div>
        <p className="text-sm font-medium text-white flex-1">{message}</p>
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          className="text-zinc-500 hover:text-white transition-colors p-1 rounded-full active:scale-90 shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
