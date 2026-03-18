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

interface SelectedItem {
  id: string;
  qty: number;
}

export default function ArmarioPage() {
  const { prendas, isLoaded, sendToLaundry } = usePrendas();
  const { tipos } = useConfig();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [toast, setToast] = useState({ visible: false, message: "" });
  
  const armarioPrendas = useMemo(
    () => prendas.filter((p) => p.estado === "en_armario"),
    [prendas]
  );

  const lavanderiaCount = useMemo(
    () => prendas.filter((p) => p.estado === "en_lavanderia").length,
    [prendas]
  );

  const isSelected = useCallback((id: string) => {
    return selectedItems.some(s => s.id === id);
  }, [selectedItems]);

  const getQty = useCallback((id: string) => {
    return selectedItems.find(s => s.id === id)?.qty ?? 1;
  }, [selectedItems]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems((prev) => 
      prev.some(s => s.id === id)
        ? prev.filter(s => s.id !== id)
        : [...prev, { id, qty: 1 }]
    );
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setSelectedItems((prev) =>
      prev.map(s => s.id === id ? { ...s, qty } : s)
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === armarioPrendas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(armarioPrendas.map(p => ({ id: p.id, qty: 1 })));
    }
  }, [selectedItems.length, armarioPrendas]);

  const handleSendToLaundry = useCallback(() => {
    const ids = selectedItems.map(s => s.id);
    const count = selectedItems.length;
    const totalBags = selectedItems.reduce((sum, s) => sum + s.qty, 0);
    sendToLaundry(ids);
    setSelectedItems([]);
    const bagInfo = totalBags > count ? ` (${totalBags} bolsas)` : "";
    setToast({
      visible: true,
      message: `¡${count} prenda${count !== 1 ? 's' : ''} enviada${count !== 1 ? 's' : ''} a lavar!${bagInfo}`,
    });
  }, [selectedItems, sendToLaundry]);

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

  const allSelected = armarioPrendas.length > 0 && selectedItems.length === armarioPrendas.length;

  return (
    <div className="min-h-full p-3 pb-28 flex flex-col gap-3">
      <header className="mb-1 mt-5 px-1 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Mi Armario</h1>
          <p className="text-cyan-200/80 font-bold text-[10px] uppercase tracking-widest mt-0.5">
            {armarioPrendas.length} prenda{armarioPrendas.length !== 1 && 's'} limpia{armarioPrendas.length !== 1 && 's'}
          </p>
        </div>
        <div className="flex gap-1.5">
          <Link href="/buscar" className="p-2 bg-zinc-800 text-zinc-300 rounded-xl transition-all active:scale-90 border border-white/5">
            <Search size={18} strokeWidth={2.5} />
          </Link>
          <Link href="/ajustes" className="p-2 bg-cyan-500 text-white rounded-xl transition-all active:scale-90 shadow-[0_4px_15px_rgba(6,182,212,0.4)] border border-cyan-400">
            <Settings size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </header>

      {/* Stats Summary - more compact */}
      {prendas.length > 0 && (
        <div className="grid grid-cols-2 gap-2 px-0.5">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-2 flex items-center gap-2 justify-center">
            <span className="text-lg font-black text-cyan-400 tabular-nums">{armarioPrendas.length}</span>
            <span className="text-[9px] font-bold text-cyan-300/60 uppercase tracking-widest">En armario</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 flex items-center gap-2 justify-center">
            <span className="text-lg font-black text-emerald-400 tabular-nums">{lavanderiaCount}</span>
            <span className="text-[9px] font-bold text-emerald-300/60 uppercase tracking-widest">Lavandería</span>
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
          <div className="flex justify-between items-center px-1">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors active:scale-95"
            >
              {allSelected ? (
                <CheckSquare size={14} className="text-cyan-400" />
              ) : (
                <Square size={14} />
              )}
              {allSelected ? "Deseleccionar" : "Seleccionar todo"}
            </button>
            {selectedItems.length > 0 && (
              <span className="text-[10px] font-bold text-cyan-400 tabular-nums">
                {selectedItems.length} sel.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {sortedKeys.map((tipoKey) => (
              <div key={tipoKey} className="flex flex-col gap-2">
                <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1 flex items-center gap-1.5">
                  {getEmojiForTipo(tipoKey, "w-3.5 h-3.5 opacity-100 normal-case")} {tipoKey} <span className="w-1 h-1 rounded-full bg-cyan-500/30"></span> <span>{groupedPrendas[tipoKey].length}</span>
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {groupedPrendas[tipoKey].map((prenda) => (
                    <PrendaCard
                      key={prenda.id}
                      prenda={prenda}
                      compact
                      selected={isSelected(prenda.id)}
                      selectedQty={getQty(prenda.id)}
                      onClick={() => toggleSelection(prenda.id)}
                      onQtyChange={(qty) => updateQty(prenda.id, qty)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedItems.length > 0 && (
        <FAB 
          label={`Enviar ${selectedItems.length} a lavar`}
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
