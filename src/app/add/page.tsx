"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Package, PlusCircle } from "lucide-react";
import { usePrendas } from "@/hooks/usePrendas";
import { isBagType, useConfig } from "@/hooks/useConfig";
import Chip from "@/components/Chip";
import { getColorName, getColorStyle } from "@/utils/colors";
import { getEmojiForTipo } from "@/utils/icons";

export default function AddPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref = from === "inicio" ? "/inicio" : "/";
  const { addPrenda } = usePrendas();
  const { tipos, colores, isLoaded } = useConfig();

  const [tipo, setTipo] = useState("");
  const [color, setColor] = useState("");
  const [detalle, setDetalle] = useState("");
  const [didTouchMultiple, setDidTouchMultiple] = useState(false);
  const [manualMultiple, setManualMultiple] = useState(false);

  const esMultiple = didTouchMultiple ? manualMultiple : tipo ? isBagType(tipo) : false;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !color) return;

    addPrenda({
      tipo,
      color,
      detalle: detalle.trim(),
      ...(esMultiple ? { esMultiple: true } : {}),
    });
    router.push(backHref);
  };

  const isFormValid = tipo.length > 0 && color.length > 0;
  const previewColor = color ? getColorStyle(color) : { background: "rgba(255,255,255,0.06)", color: "#ffffff", isDark: true };
  const saveLabel = !tipo ? "Elige una categoría" : !color ? "Elige un color" : "Guardar prenda";

  if (!isLoaded) return null;

  return (
    <div className="min-h-full px-4 pb-40 pt-5">
      <header className="mb-5 flex items-start gap-3">
        <Link
          href={backHref}
          aria-label="Volver"
          className="mt-1 rounded-2xl border border-white/10 bg-white/8 p-3 text-zinc-200 transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
            Nuevo registro
          </span>
          <h1 className="mt-3 text-[30px] font-black tracking-tight text-white">Añadir prenda</h1>
          <p className="mt-1 max-w-[15rem] text-sm leading-relaxed text-slate-300">
            Guarda cada prenda con lo justo para encontrarla rápido y enviarla a lavar sin dudar.
          </p>
        </div>
      </header>

      <section className="mb-5 rounded-[32px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Vista previa</p>
        <div className="mt-4 flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/10 shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
            style={{ background: previewColor.background, color: previewColor.color }}
          >
            {tipo ? getEmojiForTipo(tipo, "h-9 w-9") : <Package size={28} />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-white">
              {detalle ? detalle : tipo || "Tu nueva prenda"}
            </h2>
            <p className="mt-1 text-sm text-zinc-300">
              {tipo ? `${tipo}${color ? ` · ${getColorName(color)}` : ""}` : "Selecciona una categoría y un color para verla completa."}
            </p>
            {esMultiple && (
              <span className="mt-2 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                Prenda múltiple
              </span>
            )}
          </div>
        </div>
      </section>

      <form id="add-prenda-form" onSubmit={handleSave} className="space-y-4">
        <section className="rounded-[32px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">Tipo de prenda</h2>
          <p className="mt-1 text-sm text-zinc-400">Empieza por la categoría. Luego afinamos con color y detalle.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tipos.map((item) => (
              <Chip key={item} label={item} selected={tipo === item} onClick={() => setTipo(item)} />
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">Color o patrón</h2>
          <p className="mt-1 text-sm text-zinc-400">El color ayuda a reconocer la prenda de un vistazo en todo el flujo.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {colores.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={color === item}
                onClick={() => setColor(item)}
                isColorChip
              />
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">Detalle</h2>
          <p className="mt-1 text-sm text-zinc-400">Opcional, pero útil para distinguir prendas parecidas.</p>
          <input
            type="text"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            placeholder="Ej: logo pequeño, rayas, bolsillo lateral..."
            className="mt-4 w-full rounded-[22px] border border-white/10 bg-[#0a1f34] px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          />
        </section>

        <section>
          <button
            type="button"
            onClick={() => {
              setDidTouchMultiple(true);
              setManualMultiple((prev) => !prev);
            }}
            className={`flex w-full items-center gap-3 rounded-[28px] border px-4 py-3.5 transition-all active:scale-[0.98] ${
              esMultiple
                ? "border-cyan-300/30 bg-cyan-400/12 shadow-[0_12px_28px_rgba(34,211,238,0.12)]"
                : "border-white/10 bg-white/6"
            }`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${esMultiple ? "bg-cyan-400 text-white" : "bg-white/8 text-zinc-300"}`}>
              <Package size={18} />
            </div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-semibold ${esMultiple ? "text-cyan-100" : "text-zinc-200"}`}>Prenda múltiple</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Útil para bolsas de calcetines, ropa interior o grupos que envías juntos.
              </p>
            </div>
            <div className={`relative h-6 w-11 rounded-full transition-colors ${esMultiple ? "bg-cyan-400" : "bg-zinc-600"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${esMultiple ? "left-5.5" : "left-0.5"}`} />
            </div>
          </button>
        </section>
      </form>

      <div
        className="fixed bottom-24 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.25rem)" }}
      >
        <div className="rounded-[28px] border border-white/10 bg-[#07192b]/92 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <p className="px-2 pb-2 text-xs text-zinc-400">{saveLabel}</p>
          <button
            type="submit"
            form="add-prenda-form"
            disabled={!isFormValid}
            className="flex w-full items-center justify-center gap-2 rounded-[22px] border border-cyan-200/20 bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3.5 text-base font-bold text-white shadow-[0_14px_30px_rgba(34,211,238,0.28)] transition-all active:scale-[0.98] disabled:border-transparent disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
          >
            <PlusCircle size={20} />
            Guardar prenda
          </button>
        </div>
      </div>
    </div>
  );
}
