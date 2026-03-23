"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft, Search, Trash2, X } from "lucide-react";
import { usePrendas } from "@/hooks/usePrendas";
import PrendaCard from "@/components/PrendaCard";
import ConfirmSheet from "@/components/ConfirmSheet";
import { Prenda } from "@/types";

type StatusFilter = "all" | "armario" | "lavanderia";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] p-8 text-center text-zinc-400">Cargando búsqueda...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const { prendas, isLoaded, removePrenda } = usePrendas();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref = from === "lavanderia" ? "/lavanderia" : from === "inicio" ? "/inicio" : "/";
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<Prenda | null>(null);

  const filteredPrendas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return prendas.filter((prenda) => {
      const matchesQuery = `${prenda.tipo} ${prenda.color} ${prenda.detalle}`
        .toLowerCase()
        .includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "armario" && prenda.estado === "en_armario") ||
        (statusFilter === "lavanderia" && prenda.estado === "en_lavanderia");

      return matchesQuery && matchesStatus;
    });
  }, [prendas, query, statusFilter]);

  if (!isLoaded) {
    return <div className="min-h-[100dvh] p-8 text-center text-zinc-400">Cargando búsqueda...</div>;
  }

  const confirmDelete = () => {
    if (!pendingDelete) return;
    removePrenda(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <>
      <div className="min-h-full px-4 pb-36 pt-5">
        <header className="mb-5 flex items-center gap-3">
          <Link
            href={backHref}
            aria-label="Volver"
            className="rounded-2xl border border-white/10 bg-white/8 p-3 text-zinc-200 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por tipo, color o detalle"
              className="w-full rounded-[24px] border border-white/10 bg-[#0a1f34] py-3 pl-11 pr-11 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
            />
            {query && (
              <button
                type="button"
                aria-label="Borrar búsqueda"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/8 p-1.5 text-zinc-400 transition-colors hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </header>

        <section className="mb-5 rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Todo" },
              { key: "armario", label: "En armario" },
              { key: "lavanderia", label: "En lavandería" },
            ].map((filter) => {
              const isActive = statusFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setStatusFilter(filter.key as StatusFilter)}
                  className={clsx(
                    "rounded-2xl border px-3.5 py-2 text-sm font-semibold transition-all active:scale-95",
                    isActive
                      ? "border-cyan-300/40 bg-cyan-400/14 text-cyan-100"
                      : "border-white/10 bg-white/6 text-zinc-200"
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Resultados</p>
              <p className="mt-1 text-sm text-zinc-300">
                Mostrando {filteredPrendas.length} de {prendas.length} prendas.
              </p>
            </div>
            {query && <span className="text-xs text-cyan-200">Búsqueda: {query}</span>}
          </div>
        </section>

        {filteredPrendas.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-[32px] border border-white/10 bg-white/6 px-6 py-10 text-center backdrop-blur-xl">
            <Search size={48} strokeWidth={1.2} className="mb-4 text-zinc-500" />
            <h2 className="text-xl font-bold text-white">No encontramos coincidencias</h2>
            <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-zinc-300">
              Prueba otra palabra, cambia el filtro o revisa si la prenda está en otra categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredPrendas.map((prenda) => (
              <PrendaCard
                key={prenda.id}
                compact
                smallPreviewIcon
                hideTipoLabel
                prenda={prenda}
                actionButton={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDelete(prenda);
                    }}
                    className="flex w-full items-center justify-center gap-1 rounded-xl border border-red-400/18 bg-red-500/10 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-red-300 transition-all active:scale-[0.98]"
                  >
                    <Trash2 size={11} />
                    Borrar
                  </button>
                }
              >
                <div
                  className={clsx(
                    "mt-0.5 flex items-center justify-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em]",
                    prenda.estado === "en_lavanderia" ? "bg-emerald-400/12 text-emerald-200" : "bg-cyan-400/12 text-cyan-200"
                  )}
                >
                  <span
                    className={clsx(
                      "h-1 w-1 rounded-full",
                      prenda.estado === "en_lavanderia" ? "bg-emerald-300" : "bg-cyan-300"
                    )}
                  />
                  {prenda.estado === "en_lavanderia" ? "Lava" : "Armario"}
                </div>
              </PrendaCard>
            ))}
          </div>
        )}
      </div>

      <ConfirmSheet
        open={Boolean(pendingDelete)}
        title="Eliminar prenda"
        description="Esta acción quitará la prenda del inventario. Úsala solo si ya no quieres seguir controlándola aquí."
        confirmLabel="Eliminar"
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
