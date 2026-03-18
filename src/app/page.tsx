"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePrendas } from "@/hooks/usePrendas";
import { useConfig } from "@/hooks/useConfig";
import PrendaCard from "@/components/PrendaCard";
import FAB from "@/components/FAB";
import Toast from "@/components/Toast";
import ConfirmSheet from "@/components/ConfirmSheet";
import { WashingMachine, Settings, Search, CheckSquare, Square, Trash2, X } from "lucide-react";
import { getEmojiForTipo } from "@/utils/icons";
import { getColorName } from "@/utils/colors";
import { Prenda } from "@/types";

interface SelectedItem {
  id: string;
  qty: number;
}

export default function ArmarioPage() {
  const { prendas, isLoaded, sendToLaundry, removePrenda, updatePrenda } = usePrendas();
  const { tipos } = useConfig();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [editingPrenda, setEditingPrenda] = useState<Prenda | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const armarioPrendas = useMemo(() => prendas.filter((p) => p.estado === "en_armario"), [prendas]);

  const lavanderiaCount = useMemo(
    () => prendas.filter((p) => p.estado === "en_lavanderia").length,
    [prendas]
  );

  const selectedUnits = useMemo(
    () => selectedItems.reduce((total, item) => total + item.qty, 0),
    [selectedItems]
  );

  const isSelected = useCallback((id: string) => selectedItems.some((s) => s.id === id), [selectedItems]);

  const getQty = useCallback((id: string) => selectedItems.find((s) => s.id === id)?.qty ?? 1, [selectedItems]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.some((s) => s.id === id) ? prev.filter((s) => s.id !== id) : [...prev, { id, qty: 1 }]
    );
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setSelectedItems((prev) => prev.map((s) => (s.id === id ? { ...s, qty } : s)));
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === armarioPrendas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(armarioPrendas.map((p) => ({ id: p.id, qty: 1 })));
    }
  }, [selectedItems.length, armarioPrendas]);

  const handleSendToLaundry = useCallback(() => {
    if (selectedItems.length === 0) return;
    sendToLaundry(selectedItems.map((item) => ({ id: item.id, qty: item.qty })));
    setSelectedItems([]);
    setToast({
      visible: true,
      message: `${selectedUnits} unidad${selectedUnits !== 1 ? "es" : ""} enviadas a lavandería.`,
    });
  }, [selectedItems, selectedUnits, sendToLaundry]);

  const closeToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  const confirmDelete = useCallback(() => {
    if (!editingPrenda) return;
    removePrenda(editingPrenda.id);
    setShowDeleteConfirm(false);
    setEditingPrenda(null);
    setToast({ visible: true, message: "Prenda eliminada correctamente." });
  }, [editingPrenda, removePrenda]);

  const handleChangeTipo = (newTipo: string) => {
    if (!editingPrenda) return;
    updatePrenda(editingPrenda.id, { tipo: newTipo });
    setEditingPrenda(null);
    setToast({ visible: true, message: "Categoría actualizada." });
  };

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
    return <div className="min-h-[100dvh] p-8 text-center text-zinc-400">Cargando armario...</div>;
  }

  const allSelected = armarioPrendas.length > 0 && selectedItems.length === armarioPrendas.length;

  return (
    <>
      <div className="min-h-full px-4 pb-24 pt-5">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              Armario limpio
            </span>
            <div>
              <h1 className="text-[32px] font-black tracking-tight text-white">Mi Armario</h1>
              <p className="mt-1 max-w-[16rem] text-sm leading-relaxed text-slate-300">
                Organiza tu ropa limpia y prepara la próxima colada con menos pasos.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Link
              href="/buscar"
              aria-label="Buscar prendas"
              className="rounded-2xl border border-white/10 bg-white/8 p-3 text-zinc-200 transition-all active:scale-95"
            >
              <Search size={20} strokeWidth={2.4} />
            </Link>
            <Link
              href="/ajustes"
              aria-label="Abrir ajustes"
              className="rounded-2xl border border-cyan-200/20 bg-cyan-400/12 p-3 text-cyan-100 shadow-[0_12px_26px_rgba(34,211,238,0.18)] transition-all active:scale-95"
            >
              <Settings size={20} strokeWidth={2.4} />
            </Link>
          </div>
        </header>

        {prendas.length > 0 && (
          <section className="mb-4 grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between rounded-2xl border border-cyan-400/18 bg-cyan-400/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-200/80">En armario</p>
              <span className="text-[15px] font-black text-white tabular-nums">{armarioPrendas.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-emerald-400/18 bg-emerald-400/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200/80">Lavandería</p>
              <span className="text-[15px] font-black text-white tabular-nums">{lavanderiaCount}</span>
            </div>
          </section>
        )}

        {armarioPrendas.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-[32px] border border-white/10 bg-white/6 px-6 py-10 text-center backdrop-blur-xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-2xl" />
              <div className="relative rounded-full border border-white/10 bg-white/10 p-6">
                <WashingMachine size={68} strokeWidth={1.2} className="text-cyan-300" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Tu armario está vacío</h2>
            <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-zinc-300">
              Añade ropa nueva o recupera prendas desde la lavandería para empezar a usar la app con ritmo.
            </p>
            <Link
              href="/add"
              className="mt-6 rounded-2xl border border-cyan-200/20 bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 font-bold text-white shadow-[0_14px_30px_rgba(34,211,238,0.28)] transition-all active:scale-95"
            >
              Añadir primera prenda
            </Link>
          </div>
        ) : (
          <>
            <section className="mb-4 rounded-2xl border border-white/10 bg-white/6 p-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-all active:scale-95"
                >
                  {allSelected ? <CheckSquare size={14} className="text-cyan-300" /> : <Square size={14} />}
                  {allSelected ? "Limpiar selección" : "Seleccionar todo"}
                </button>
                {selectedItems.length > 0 ? (
                  <span className="text-[11px] font-semibold text-cyan-200">
                    {selectedItems.length} prenda{selectedItems.length !== 1 ? "s" : ""}
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">Toca las tarjetas para preparar tu colada</span>
                )}
              </div>
              {selectedItems.length > 0 && (
                <p className="mt-1.5 text-xs text-zinc-300">
                  Has seleccionado {selectedUnits} unidad{selectedUnits !== 1 ? "es" : ""} para lavar.
                </p>
              )}
            </section>

            <div className="space-y-4">
              {sortedKeys.map((tipoKey) => (
                <section key={tipoKey} className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-white/70">
                      {getEmojiForTipo(tipoKey, "h-5 w-5 opacity-100 normal-case")}
                      <span>{tipoKey}</span>
                    </h2>
                    <span className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-bold text-zinc-300">
                      {groupedPrendas[tipoKey].length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {groupedPrendas[tipoKey].map((prenda) => (
                      <PrendaCard
                        key={prenda.id}
                        prenda={prenda}
                        compact
                        selected={isSelected(prenda.id)}
                        selectedQty={getQty(prenda.id)}
                        onClick={() => toggleSelection(prenda.id)}
                        onQtyChange={(qty) => updateQty(prenda.id, qty)}
                        onEditClick={() => setEditingPrenda(prenda)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>

      {editingPrenda && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center">
          <button
            type="button"
            aria-label="Cerrar edición"
            onClick={() => setEditingPrenda(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full rounded-t-[32px] border border-white/10 bg-[#07192b] px-5 pb-8 pt-5 shadow-[0_-18px_44px_rgba(0,0,0,0.5)]">
            <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-white/12" />
            <button
              onClick={() => setEditingPrenda(null)}
              className="absolute right-4 top-4 rounded-full bg-white/8 p-2 text-zinc-400 transition-colors hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="mb-6 flex items-center gap-3 pr-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8">
                {getEmojiForTipo(editingPrenda.tipo, "h-8 w-8")}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingPrenda.detalle ? editingPrenda.detalle : editingPrenda.tipo}
                </h3>
                <p className="text-sm text-zinc-300">{getColorName(editingPrenda.color)}</p>
              </div>
            </div>

            <div className="mb-6 rounded-[28px] border border-white/10 bg-white/6 p-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Cambiar categoría</p>
              <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto pr-2">
                {tipos.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => handleChangeTipo(tipo)}
                    className={`rounded-2xl border px-3.5 py-2 text-sm font-semibold transition-all active:scale-95 ${
                      tipo === editingPrenda.tipo
                        ? "border-cyan-300/40 bg-cyan-400/16 text-cyan-100"
                        : "border-white/10 bg-white/6 text-zinc-200"
                    }`}
                  >
                    <span className="mr-1 inline-flex align-middle">{getEmojiForTipo(tipo, "h-4 w-4")}</span>
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/18 bg-red-500/12 py-3.5 font-bold text-red-300 transition-all active:scale-[0.98]"
            >
              <Trash2 size={18} />
              Eliminar prenda
            </button>
          </div>
        </div>
      )}

      <ConfirmSheet
        open={showDeleteConfirm}
        title="Eliminar prenda"
        description="La prenda se quitará de tu armario y no podrás recuperarla después."
        confirmLabel="Eliminar"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
      />

      {selectedItems.length > 0 && (
        <FAB
          label={`Enviar ${selectedUnits} a lavar`}
          onClick={handleSendToLaundry}
          icon={<WashingMachine size={20} />}
        />
      )}

      <Toast visible={toast.visible} message={toast.message} onClose={closeToast} />
    </>
  );
}
