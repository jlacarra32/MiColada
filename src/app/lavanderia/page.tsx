"use client";

import Link from "next/link";
import { usePrendas } from "@/hooks/usePrendas";
import { useConfig } from "@/hooks/useConfig";
import PrendaCard from "@/components/PrendaCard";
import TimeAgoText from "@/components/TimeAgoText";
import { WashingMachine, Settings, Search, CheckCircle2, Waves } from "lucide-react";
import { getEmojiForTipo } from "@/utils/icons";

export default function LavanderiaPage() {
  const { prendas, isLoaded, receiveFromLaundry } = usePrendas();
  const { tipos } = useConfig();
  
  const lavanderiaPrendas = prendas.filter((p) => p.estado === "en_lavanderia")
    .sort((a, b) => (b.fechaEnvio || 0) - (a.fechaEnvio || 0));

  if (!isLoaded) {
    return <div className="p-8 text-center text-zinc-500 min-h-[100dvh]">Cargando lavandería...</div>;
  }

  // Grupos por tipo
  const groupedPrendas = lavanderiaPrendas.reduce<Record<string, typeof prendas>>((acc, prenda) => {
    if (!acc[prenda.tipo]) acc[prenda.tipo] = [];
    acc[prenda.tipo].push(prenda);
    return acc;
  }, {});

  // Ordenar categorías según config
  const sortedKeys = Object.keys(groupedPrendas).sort((a, b) => {
    const idxA = tipos.indexOf(a);
    const idxB = tipos.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="min-h-full p-4 pb-28 flex flex-col gap-4">
      <header className="mb-4 mt-6 px-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Lavandería</h1>
          <p className="text-emerald-300/80 font-bold text-xs uppercase tracking-widest mt-1">
            {lavanderiaPrendas.length} prenda{lavanderiaPrendas.length !== 1 && 's'} lavándose
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/buscar" className="p-2.5 bg-zinc-800 text-zinc-300 rounded-xl transition-all active:scale-90 border border-white/5">
            <Search size={20} strokeWidth={2.5} />
          </Link>
          <Link href="/ajustes" className="p-2.5 bg-cyan-500 text-white rounded-xl transition-all active:scale-90 shadow-[0_4px_15px_rgba(6,182,212,0.4)] border border-cyan-400">
            <Settings size={20} strokeWidth={2.5} />
          </Link>
        </div>
      </header>

      {lavanderiaPrendas.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center mt-12 p-6 text-center">
          <div className="relative mb-8 transition-transform hover:scale-105 duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full blur-2xl opacity-40"></div>
            <div className="bg-white/10 p-6 rounded-full shadow-lg border border-white/10 relative backdrop-blur-md">
              <Waves size={72} strokeWidth={1} className="text-emerald-400/80" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight drop-shadow-md text-white">¡Todo limpio y en su sitio!</p>
          <p className="text-base mt-3 text-zinc-400 max-w-[260px] leading-relaxed">
            No tienes ropa en la lavandería en este momento.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {sortedKeys.map((tipoKey) => (
            <div key={tipoKey} className="flex flex-col gap-4">
              <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                {getEmojiForTipo(tipoKey, "w-4 h-4 opacity-100 normal-case")} {tipoKey} <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30"></span> <span>{groupedPrendas[tipoKey].length}</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {groupedPrendas[tipoKey].map((prenda) => (
                  <PrendaCard
                    key={prenda.id}
                    prenda={prenda}
                    actionButton={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          receiveFromLaundry(prenda.id);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 text-emerald-500 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 group font-bold text-[10px] uppercase tracking-wider"
                      >
                        <CheckCircle2 size={14} />
                        Recibido
                      </button>
                    }
                  >
                    {prenda.fechaEnvio && <TimeAgoText timestamp={prenda.fechaEnvio} />}
                  </PrendaCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
