"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePrendas } from "@/hooks/usePrendas";
import { useConfig } from "@/hooks/useConfig";
import PrendaCard from "@/components/PrendaCard";
import FAB from "@/components/FAB";
import Toast from "@/components/Toast";
import { WashingMachine, Settings, Search, CheckSquare, Square } from "lucide-react";
import { getEmojiForTipo } from "@/utils/icons";

export default function ArmarioPage() {
  const { prendas, isLoaded, sendToLaundry } = usePrendas();
  const { tipos } = useConfig();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState({ visible: false, message: "" });
  
  const armarioPrendas = useMemo(
    () => prendas.filter((p) => p.estado === "en_armario"),
    [prendas]
  );

  const lavanderiaCount = useMemo(
    () => prendas.filter((p) => p.estado === "en_lavanderia").length,
    [prendas]
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === armarioPrendas.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(armarioPrendas.map(p => p.id));
    }
  }, [selectedIds.length, armarioPrendas]);

  const handleSendToLaundry = useCallback(() => {
    const count = selectedIds.length;
    sendToLaundry(selectedIds);
    setSelectedIds([]);
    setToast({
      visible: true,
      message: `¡${count} prenda${count !== 1 ? 's' : ''} enviada${count !== 1 ? 's' : ''} a lavar!`,
    });
  }, [selectedIds, sendToLaundry]);

  const closeToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  // Grouped and sorted prendas
  const { groupedPrendas, sortedKeys } = useMemo(() => {
    const grouped = armarioPrendas.reduce<Record<string, typeof prendas>>((acc, prenda) => {
      if (!acc[prenda.tipo]) acc[prenda.tipo] = [];
      acc[prenda.tipo].push(prenda);
      return acc;
    }, {});

    const keys = Object.keys(grouped).sort((a, b) => {
      const idxA = tipos.indexOf(a);
      const idxB = tipos.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

    return { groupedPrendas: grouped, sortedKeys: keys };
  }, [armarioPrendas, tipos]);

  if (!isLoaded) {
    return <div className="p-8 text-center text-zinc-500 min-h-[100dvh]">Cargando armario...</div>;
  }

  const allSelected = armarioPrendas.length > 0 && selectedIds.length === armarioPrendas.length;

  return (
    <div className="min-h-full p-4 pb-28 flex flex-col gap-4">
      <header className="mb-2 mt-6 px-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Mi Armario</h1>
          <p className="text-cyan-200/80 font-bold text-xs uppercase tracking-widest mt-1">
            {armarioPrendas.length} prenda{armarioPrendas.length !== 1 && 's'} limpia{armarioPrendas.length !== 1 && 's'}
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

      {/* Stats Summary */}
      {prendas.length > 0 && (
        <div className="grid grid-cols-2 gap-3 px-1">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-2xl font-black text-cyan-400 tabular-nums">{armarioPrendas.length}</span>
            <span className="text-[10px] font-bold text-cyan-300/60 uppercase tracking-widest">En armario</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-2xl font-black text-emerald-400 tabular-nums">{lavanderiaCount}</span>
            <span className="text-[10px] font-bold text-emerald-300/60 uppercase tracking-widest">En lavandería</span>
          </div>
        </div>
      )}

      {armarioPrendas.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center mt-12 p-6 text-center">
          <div className="relative mb-8 transition-transform hover:scale-105 duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-40"></div>
            <div className="bg-white/10 p-6 rounded-full shadow-lg border border-white/10 relative backdrop-blur-md">
              <WashingMachine size={72} strokeWidth={1} className="text-cyan-400/80" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight drop-shadow-md text-white">¡Tu armario está vacío!</p>
          <p className="text-base mt-3 text-zinc-400 max-w-[260px] leading-relaxed">
            Añade ropa nueva o recibe la que ya enviaste a la lavandería.
          </p>
          <Link
            href="/add"
            className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-cyan-500/30 border border-white/10"
          >
            + Añadir primera prenda
          </Link>
        </div>
      ) : (
        <>
          {/* Select All Bar */}
          <div className="flex justify-between items-center px-2">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors active:scale-95"
            >
              {allSelected ? (
                <CheckSquare size={16} className="text-cyan-400" />
              ) : (
                <Square size={16} />
              )}
              {allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
            </button>
            {selectedIds.length > 0 && (
              <span className="text-xs font-bold text-cyan-400 tabular-nums">
                {selectedIds.length} seleccionada{selectedIds.length !== 1 && "s"}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-8">
            {sortedKeys.map((tipoKey) => (
              <div key={tipoKey} className="flex flex-col gap-4">
                <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                  {getEmojiForTipo(tipoKey, "w-4 h-4 opacity-100 normal-case")} {tipoKey} <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/30"></span> <span>{groupedPrendas[tipoKey].length}</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {groupedPrendas[tipoKey].map((prenda) => (
                    <PrendaCard
                      key={prenda.id}
                      prenda={prenda}
                      selected={selectedIds.includes(prenda.id)}
                      onClick={() => toggleSelection(prenda.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedIds.length > 0 && (
        <FAB 
          label={`Enviar ${selectedIds.length} a lavar`}
          onClick={handleSendToLaundry}
          icon={<WashingMachine size={20} />}
        />
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        onClose={closeToast}
      />
    </div>
  );
}
