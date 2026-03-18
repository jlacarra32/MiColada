"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrendas } from "@/hooks/usePrendas";
import { useConfig, isBagType } from "@/hooks/useConfig";
import Chip from "@/components/Chip";
import { PlusCircle, Minus, Plus, Package } from "lucide-react";
import { getEmojiForTipo } from "@/utils/icons";

export default function AddPage() {
  const router = useRouter();
  const { addPrenda } = usePrendas();
  const { tipos, colores, isLoaded } = useConfig();
  
  const [tipo, setTipo] = useState("");
  const [color, setColor] = useState("");
  const [detalle, setDetalle] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const showCantidad = tipo && isBagType(tipo);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !color) return;

    addPrenda({
      tipo,
      color,
      detalle: detalle.trim(),
      ...(showCantidad ? { cantidad } : {}),
    });
    router.push("/");
  };

  const handleTipoSelect = (t: string) => {
    setTipo(t);
    // Reset cantidad when switching types
    if (!isBagType(t)) {
      setCantidad(1);
    }
  };

  const isFormValid = tipo.length > 0 && color.length > 0;

  if (!isLoaded) return null;

  return (
    <div className="min-h-full flex flex-col bg-transparent">
      <header className="p-4 pt-8 px-6 bg-zinc-900/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Añadir Prenda</h1>
        <p className="text-zinc-400 text-sm mt-1 font-medium">Registra ropa nueva en tu armario.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSave} className="flex flex-col gap-8">
          
          <section>
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">Tipo de Prenda</h2>
            <div className="flex flex-wrap gap-2">
              {tipos.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={tipo === t}
                  onClick={() => handleTipoSelect(t)}
                />
              ))}
            </div>
          </section>

          {/* Quantity selector for bag-based items */}
          {showCantidad && (
            <section className="animate-in slide-in-from-top-2 fade-in duration-300">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Package size={14} />
                Cantidad de Bolsas
              </h2>
              <div className="bg-zinc-800/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getEmojiForTipo(tipo, "w-8 h-8")}
                  <div>
                    <p className="text-white font-semibold text-sm">{tipo}</p>
                    <p className="text-zinc-500 text-xs">
                      {cantidad === 1 ? "1 bolsa" : `${cantidad} bolsas`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                    className="w-10 h-10 rounded-xl bg-zinc-700/80 border border-white/10 flex items-center justify-center text-white transition-all active:scale-90 disabled:opacity-30 disabled:scale-100 hover:bg-zinc-600"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 text-center font-black text-xl text-white tabular-nums">
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                    disabled={cantidad >= 10}
                    className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 transition-all active:scale-90 disabled:opacity-30 disabled:scale-100 hover:bg-cyan-500/30"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">Color o Patrón</h2>
            <div className="flex flex-wrap gap-2">
              {colores.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={color === c}
                  onClick={() => setColor(c)}
                  isColorChip
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">Detalle <span className="text-cyan-700 font-medium lowercase">(Opcional)</span></h2>
            <input
              type="text"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Ej: Logo de Batman, Rayas rojas..."
              className="w-full px-5 py-4 bg-zinc-800/80 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-sm text-zinc-100 placeholder:text-zinc-500 font-medium"
            />
          </section>
        </form>
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-zinc-900/80 backdrop-blur-md border-t border-white/5 pb-safe z-10 flex justify-center pb-8 pt-6">
        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className="w-11/12 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 disabled:opacity-100 disabled:scale-100 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-lg shadow-cyan-500/20 disabled:shadow-none disabled:translate-y-0 text-lg border border-white/10 disabled:border-transparent"
        >
          <PlusCircle size={22} className={!isFormValid ? "opacity-50" : ""} />
          {showCantidad && cantidad > 1
            ? `Guardar ${cantidad} Bolsas`
            : "Guardar Prenda"
          }
        </button>
      </div>
    </div>
  );
}
