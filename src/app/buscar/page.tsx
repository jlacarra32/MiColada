"use client";

import { useState } from "react";
import { usePrendas } from "@/hooks/usePrendas";
import PrendaCard from "@/components/PrendaCard";
import { Search, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { getEmojiForTipo } from "@/utils/icons";

export default function SearchPage() {
  const { prendas, isLoaded, removePrenda } = usePrendas();
  const [query, setQuery] = useState("");

  if (!isLoaded) return <div className="p-8 text-center text-zinc-500 min-h-[100dvh]">Cargando...</div>;

  const filteredPrendas = prendas.filter((p) => {
    const searchStr = `${p.tipo} ${p.color} ${p.detalle}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-full flex flex-col bg-transparent">
      <header className="p-4 pt-8 px-6 bg-zinc-900/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <Link href="/" className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90 shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por tipo, color..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/80 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white placeholder:text-zinc-600 text-sm font-medium"
          />
        </div>
      </header>

      <div className="flex-1 p-3 pb-32">
        <div className="grid grid-cols-3 gap-2">
          {filteredPrendas.map((prenda) => (
            <PrendaCard
              key={prenda.id}
              compact
              prenda={prenda}
              actionButton={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("¿Seguro que quieres eliminar esta prenda?")) {
                      removePrenda(prenda.id);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-zinc-500 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all active:scale-95 group font-bold text-[10px] uppercase tracking-wider"
                >
                  <Trash2 size={13} />
                  Eliminar
                </button>
              }
            >
              <div className={clsx(
                "text-[9px] font-bold uppercase tracking-widest mt-1 px-2 py-0.5 rounded flex items-center gap-1.5 justify-center",
                prenda.estado === "en_lavanderia" ? "text-emerald-400 bg-emerald-400/10" : "text-cyan-400 bg-cyan-400/10"
              )}>
                <span className={clsx("w-1 h-1 rounded-full", prenda.estado === "en_lavanderia" ? "bg-emerald-400" : "bg-cyan-400")}></span>
                {prenda.estado === "en_lavanderia" ? "En Lavandería" : "En Armario"}
              </div>
            </PrendaCard>
          ))}
        </div>

        {filteredPrendas.length === 0 && query && (
          <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500">
            <Search size={48} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="font-medium text-zinc-400">No hemos encontrado nada para "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
