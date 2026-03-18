"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrendas } from "@/hooks/usePrendas";
import { useConfig } from "@/hooks/useConfig";
import Chip from "@/components/Chip";
import { PlusCircle, Package } from "lucide-react";

export default function AddPage() {
  const router = useRouter();
  const { addPrenda } = usePrendas();
  const { tipos, colores, isLoaded } = useConfig();
  
  const [tipo, setTipo] = useState("");
  const [color, setColor] = useState("");
  const [detalle, setDetalle] = useState("");
  const [esMultiple, setEsMultiple] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !color) return;

    addPrenda({
      tipo,
      color,
      detalle: detalle.trim(),
      ...(esMultiple ? { esMultiple: true } : {}),
    });
    router.push("/");
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
        <form onSubmit={handleSave} className="flex flex-col gap-7">
          
          <section>
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">Tipo de Prenda</h2>
            <div className="flex flex-wrap gap-2">
              {tipos.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={tipo === t}
                  onClick={() => setTipo(t)}
                />
              ))}
            </div>
          </section>

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
              className="w-full px-5 py-3.5 bg-zinc-800/80 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-sm text-zinc-100 placeholder:text-zinc-500 font-medium text-sm"
            />
          </section>

          {/* Multiple toggle — for items like underwear bags */}
          <section>
            <button
              type="button"
              onClick={() => setEsMultiple(!esMultiple)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all active:scale-[0.98] ${
                esMultiple
                  ? "bg-cyan-500/15 border-cyan-500/40 shadow-sm"
                  : "bg-zinc-800/60 border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                esMultiple ? "bg-cyan-500 text-white" : "bg-zinc-700 text-zinc-400"
              }`}>
                <Package size={16} />
              </div>
              <div className="text-left flex-1">
                <p className={`text-sm font-semibold ${esMultiple ? "text-cyan-300" : "text-zinc-300"}`}>
                  Se envía en bolsas
                </p>
                <p className="text-[11px] text-zinc-500 leading-tight">
                  Podrás elegir cuántas bolsas envías cada vez
                </p>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${
                esMultiple ? "bg-cyan-500" : "bg-zinc-600"
              }`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  esMultiple ? "left-5.5" : "left-0.5"
                }`} />
              </div>
            </button>
          </section>
        </form>
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-zinc-900/80 backdrop-blur-md border-t border-white/5 pb-safe z-10 flex justify-center pb-8 pt-6">
        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className="w-11/12 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 disabled:opacity-100 disabled:scale-100 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-lg shadow-cyan-500/20 disabled:shadow-none disabled:translate-y-0 text-base border border-white/10 disabled:border-transparent"
        >
          <PlusCircle size={20} className={!isFormValid ? "opacity-50" : ""} />
          Guardar Prenda
        </button>
      </div>
    </div>
  );
}
