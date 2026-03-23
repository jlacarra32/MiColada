"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, X, ArrowLeft } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import { getColorName, getColorStyle } from "@/utils/colors";
import { getEmojiForTipo } from "@/utils/icons";
import ConfirmSheet from "@/components/ConfirmSheet";

type PendingRemoval =
  | { kind: "tipo"; value: string }
  | { kind: "color"; value: string }
  | null;

const SPANISH_COLORS: Record<string, string> = {
  rojo: "#ef4444", azul: "#3b82f6", verde: "#22c55e", amarillo: "#eab308", 
  naranja: "#f97316", morado: "#a855f7", rosa: "#ec4899", fucsia: "#d946ef",
  blanco: "#ffffff", negro: "#000000", gris: "#71717a", marron: "#78350f",
  "marrón": "#78350f", beige: "#f5f5dc", celeste: "#38bdf8", turquesa: "#2dd4bf",
  cian: "#06b6d4", lima: "#84cc16", marino: "#1e3a8a", "azul marino": "#1e3a8a",
  vino: "#881337", burdeos: "#881337", lila: "#d8b4e2", violeta: "#8b5cf6",
  crema: "#fef3c7", arena: "#d6d3d1", mostaza: "#ca8a04", coral: "#f43f5e",
  salmon: "#fb7185", "salmón": "#fb7185", esmeralda: "#10b981", oliva: "#4d7c0f",
  plata: "#a1a1aa", oro: "#fbbf24", dorado: "#fbbf24", "azul noche": "#172554",
  caqui: "#f0e68c", pistacho: "#93c572", menta: "#98ff98", cebra: "#ffffff",
  "verde militar": "#4b5320", granate: "#800000", añil: "#4b0082",
};

export default function ConfigPage() {
  const { tipos, colores, isLoaded, addTipo, removeTipo, addColor, removeColor } = useConfig();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref = from === "lavanderia" ? "/lavanderia" : from === "inicio" ? "/inicio" : "/";

  const [newTipo, setNewTipo] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newHex, setNewHex] = useState("#3b82f6");
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval>(null);

  const handleAddTipo = (e: React.FormEvent) => {
    e.preventDefault();
    addTipo(newTipo);
    setNewTipo("");
  };

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.trim()) return;
    addColor(`${newColor.trim()}|${newHex}`);
    setNewColor("");
  };

  const confirmRemoval = () => {
    if (!pendingRemoval) return;
    if (pendingRemoval.kind === "tipo") {
      removeTipo(pendingRemoval.value);
    } else {
      removeColor(pendingRemoval.value);
    }
    setPendingRemoval(null);
  };

  if (!isLoaded) return <div className="min-h-[100dvh] p-8 text-center text-zinc-400">Cargando ajustes...</div>;

  return (
    <>
      <div className="min-h-full px-4 pb-36 pt-5">
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
              Personalización
            </span>
            <h1 className="mt-3 text-[30px] font-black tracking-tight text-white">Ajustes</h1>
            <p className="mt-1 max-w-[16rem] text-sm leading-relaxed text-slate-300">
              Mantén limpias tus categorías y colores para que añadir y buscar prendas sea más rápido.
            </p>
          </div>
        </header>

        <div className="space-y-5">
          <section className="rounded-[32px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">Tipos de prenda</h2>
              <p className="mt-1 text-sm text-zinc-400">Solo afectan a nuevas selecciones y a futuras ediciones.</p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {tipos.map((tipo) => (
                <div
                  key={tipo}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-sm font-medium text-zinc-100"
                >
                  {getEmojiForTipo(tipo, "h-4 w-4")}
                  <span>{tipo}</span>
                  <button
                    type="button"
                    aria-label={`Eliminar ${tipo}`}
                    onClick={() => setPendingRemoval({ kind: "tipo", value: tipo })}
                    className="rounded-full p-1 text-zinc-500 transition-colors hover:text-red-300"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTipo} className="flex gap-2">
              <input
                type="text"
                value={newTipo}
                onChange={(e) => setNewTipo(e.target.value)}
                placeholder="Nueva categoría..."
                className="flex-1 rounded-[22px] border border-white/10 bg-[#0a1f34] px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              />
              <button
                type="submit"
                disabled={!newTipo.trim()}
                className="rounded-[22px] border border-cyan-200/20 bg-gradient-to-r from-cyan-400 to-sky-500 p-3 text-white shadow-[0_12px_26px_rgba(34,211,238,0.22)] transition-all active:scale-95 disabled:border-transparent disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
              >
                <Plus size={20} />
              </button>
            </form>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">Colores y patrones</h2>
              <p className="mt-1 text-sm text-zinc-400">Añade tonos propios para identificar tu ropa más rápido.</p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {colores.map((color) => {
                const colorStyle = getColorStyle(color);
                return (
                  <div
                    key={color}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-sm font-medium text-zinc-100"
                  >
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/20 shadow-inner"
                      style={{ background: colorStyle.background }}
                    />
                    <span>{getColorName(color)}</span>
                    <button
                      type="button"
                      aria-label={`Eliminar ${getColorName(color)}`}
                      onClick={() => setPendingRemoval({ kind: "color", value: color })}
                      className="rounded-full p-1 text-zinc-500 transition-colors hover:text-red-300"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleAddColor}
              className="flex items-center gap-2 rounded-[24px] border border-white/10 bg-[#0a1f34] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
            >
              <div className="relative h-11 w-11 overflow-hidden rounded-[16px] border border-white/12 bg-black/20">
                <input
                  type="color"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  className="absolute -left-2 -top-2 h-16 w-16 cursor-pointer border-0 bg-transparent p-0"
                />
              </div>
              <input
                type="text"
                value={newColor}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewColor(val);
                  const lowerName = val.trim().toLowerCase();
                  if (SPANISH_COLORS[lowerName]) {
                    setNewHex(SPANISH_COLORS[lowerName]);
                  }
                }}
                placeholder="Ej: fucsia, arena, azul noche..."
                className="flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newColor.trim()}
                className="rounded-[18px] border border-cyan-200/20 bg-gradient-to-r from-cyan-400 to-sky-500 p-2.5 text-white shadow-[0_12px_26px_rgba(34,211,238,0.22)] transition-all active:scale-95 disabled:border-transparent disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
              >
                <Plus size={20} />
              </button>
            </form>
          </section>
        </div>
      </div>

      <ConfirmSheet
        open={Boolean(pendingRemoval)}
        title={pendingRemoval?.kind === "tipo" ? "Eliminar categoría" : "Eliminar color"}
        description={
          pendingRemoval?.kind === "tipo"
            ? "Dejará de aparecer al añadir o editar prendas, pero no borrará las que ya tengas guardadas."
            : "Dejará de aparecer como opción al registrar o editar prendas, pero no borrará las existentes."
        }
        confirmLabel="Eliminar"
        onClose={() => setPendingRemoval(null)}
        onConfirm={confirmRemoval}
      />
    </>
  );
}
