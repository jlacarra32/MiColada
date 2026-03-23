"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePrendas } from "@/hooks/usePrendas";
import PrendaCard from "@/components/PrendaCard";
import TimeAgoText from "@/components/TimeAgoText";
import Toast from "@/components/Toast";
import FAB from "@/components/FAB";
import { Settings, PlusCircle, CheckCircle2, Waves, PackageCheck, WashingMachine, Shirt } from "lucide-react";

export default function InicioPage() {
  const { prendas, isLoaded, receiveFromLaundry, receiveManyFromLaundry } = usePrendas();
  const [toast, setToast] = useState({ visible: false, message: "" });

  const lavanderiaPrendas = useMemo(
    () =>
      prendas
        .filter((p) => p.estado === "en_lavanderia")
        .sort((a, b) => (b.fechaEnvio || 0) - (a.fechaEnvio || 0)),
    [prendas]
  );

  const armarioCount = useMemo(() => prendas.filter((p) => p.estado === "en_armario").length, [prendas]);

  const closeToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  const handleReceiveAll = useCallback(() => {
    if (lavanderiaPrendas.length === 0) return;
    receiveManyFromLaundry(lavanderiaPrendas.map((p) => p.id));
    setToast({
      visible: true,
      message: `${lavanderiaPrendas.length} prenda${lavanderiaPrendas.length !== 1 ? "s" : ""} recibidas.`,
    });
  }, [lavanderiaPrendas, receiveManyFromLaundry]);

  const handleReceiveOne = useCallback(
    (id: string) => {
      receiveFromLaundry(id);
      setToast({ visible: true, message: "Prenda recibida y devuelta al armario." });
    },
    [receiveFromLaundry]
  );

  if (!isLoaded) {
    return <div className="min-h-[100dvh] p-8 text-center text-zinc-400">Cargando...</div>;
  }

  return (
    <>
      <div className="min-h-full px-4 pb-24 pt-5">
        <header className="mb-5">
          <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
            Panel
          </span>
          <h1 className="mt-3 text-[32px] font-black tracking-tight text-white">Inicio</h1>
        </header>

        {/* Quick stats */}
        <section className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between rounded-2xl border border-cyan-400/18 bg-cyan-400/10 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Shirt size={14} className="text-cyan-300" />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-200/80">Armario</p>
            </div>
            <span className="text-[15px] font-black text-white tabular-nums">{armarioCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-emerald-400/18 bg-emerald-400/10 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <WashingMachine size={14} className="text-emerald-300" />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200/80">Lavandería</p>
            </div>
            <span className="text-[15px] font-black text-white tabular-nums">{lavanderiaPrendas.length}</span>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-5 grid grid-cols-2 gap-3">
          <Link
            href="/add?from=inicio"
            className="flex flex-col items-center gap-2 rounded-[24px] border border-cyan-200/20 bg-gradient-to-br from-cyan-400/20 to-sky-500/10 px-4 py-4 text-center transition-all active:scale-[0.97]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-white shadow-[0_8px_20px_rgba(34,211,238,0.3)]">
              <PlusCircle size={22} strokeWidth={2.4} />
            </div>
            <span className="text-sm font-bold text-white">Añadir prenda</span>
          </Link>

          <Link
            href="/ajustes?from=inicio"
            className="flex flex-col items-center gap-2 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 text-center transition-all active:scale-[0.97]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-zinc-200">
              <Settings size={22} strokeWidth={2.2} />
            </div>
            <span className="text-sm font-bold text-zinc-200">Ajustes</span>
          </Link>
        </section>

        {/* Laundry summary */}
        <div className="mb-3 flex items-center gap-2 px-1">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">En lavandería</h2>
          {lavanderiaPrendas.length > 0 && (
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              {lavanderiaPrendas.length}
            </span>
          )}
        </div>

        {lavanderiaPrendas.length === 0 ? (
          <div className="flex flex-col items-center rounded-[32px] border border-white/10 bg-white/6 px-6 py-8 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="relative rounded-full border border-white/10 bg-white/10 p-4">
                <Waves size={36} strokeWidth={1.2} className="text-emerald-300" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Todo limpio y en su sitio</h3>
            <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-zinc-400">
              No hay prendas en la lavandería ahora mismo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {lavanderiaPrendas.map((prenda) => (
              <PrendaCard
                key={prenda.id}
                prenda={prenda}
                compact
                smallPreviewIcon
                hideTipoLabel
                actionButton={
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReceiveOne(prenda.id);
                    }}
                    className="mt-1 flex w-full items-center justify-center gap-1 rounded-xl bg-black/20 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md transition-all active:scale-[0.96]"
                  >
                    <CheckCircle2 size={11} />
                    OK
                  </button>
                }
              >
                {prenda.fechaEnvio && (
                  <div className="mt-0.5 flex items-center justify-center gap-1 rounded-full bg-black/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white/70">
                    <TimeAgoText timestamp={prenda.fechaEnvio} />
                  </div>
                )}
              </PrendaCard>
            ))}
          </div>
        )}
      </div>

      {lavanderiaPrendas.length > 1 && (
        <FAB
          label={`Recibir ${lavanderiaPrendas.length} prendas`}
          onClick={handleReceiveAll}
          icon={<PackageCheck size={20} />}
        />
      )}

      <Toast visible={toast.visible} message={toast.message} onClose={closeToast} />
    </>
  );
}
