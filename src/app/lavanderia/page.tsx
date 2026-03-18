"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePrendas } from "@/hooks/usePrendas";
import PrendaCard from "@/components/PrendaCard";
import TimeAgoText from "@/components/TimeAgoText";
import Toast from "@/components/Toast";
import FAB from "@/components/FAB";
import { Settings, Search, CheckCircle2, Waves, PackageCheck } from "lucide-react";

export default function LavanderiaPage() {
  const { prendas, isLoaded, receiveFromLaundry, receiveManyFromLaundry } = usePrendas();
  const [toast, setToast] = useState({ visible: false, message: "" });

  const lavanderiaPrendas = useMemo(
    () =>
      prendas
        .filter((p) => p.estado === "en_lavanderia")
        .sort((a, b) => (b.fechaEnvio || 0) - (a.fechaEnvio || 0)),
    [prendas]
  );

  const closeToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  const handleReceiveAll = useCallback(() => {
    if (lavanderiaPrendas.length === 0) return;
    receiveManyFromLaundry(lavanderiaPrendas.map((prenda) => prenda.id));
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
    return <div className="min-h-[100dvh] p-8 text-center text-zinc-400">Cargando lavandería...</div>;
  }

  return (
    <>
      <div className="min-h-full px-4 pb-24 pt-5">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200">
              En proceso
            </span>
            <div>
              <h1 className="text-[32px] font-black tracking-tight text-white">Lavandería</h1>
              <p className="mt-1 max-w-[16rem] text-sm leading-relaxed text-slate-300">
                Revisa lo que está fuera y marca cada prenda cuando vuelva limpia al armario.
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

        {lavanderiaPrendas.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-[32px] border border-white/10 bg-white/6 px-6 py-10 text-center backdrop-blur-xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-2xl" />
              <div className="relative rounded-full border border-white/10 bg-white/10 p-6">
                <Waves size={68} strokeWidth={1.2} className="text-emerald-300" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Todo limpio y en su sitio</h2>
            <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-zinc-300">
              No tienes ropa pendiente ahora mismo. Cuando envíes prendas desde el armario aparecerán aquí.
            </p>
          </div>
        ) : (
          <>
            <section className="mb-5 rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">Resumen de colada</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-black text-white tabular-nums">{lavanderiaPrendas.length}</p>
                  <p className="mt-1 text-sm text-zinc-300">prendas esperando a ser recibidas</p>
                </div>
                {lavanderiaPrendas[0]?.fechaEnvio && (
                  <div className="rounded-2xl bg-white/6 px-3 py-2 text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Último envío</p>
                    <TimeAgoText timestamp={lavanderiaPrendas[0].fechaEnvio} />
                  </div>
                )}
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              {lavanderiaPrendas.map((prenda) => (
                <PrendaCard
                  key={prenda.id}
                  prenda={prenda}
                  compact
                  actionButton={
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReceiveOne(prenda.id);
                      }}
                      className="flex w-full items-center justify-center gap-1 rounded-2xl border border-emerald-400/20 bg-emerald-500/12 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-200 transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 size={12} />
                      Recibida
                    </button>
                  }
                >
                  {prenda.fechaEnvio && <TimeAgoText timestamp={prenda.fechaEnvio} />}
                </PrendaCard>
              ))}
            </div>
          </>
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
