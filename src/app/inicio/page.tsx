"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePrendas } from "@/hooks/usePrendas";
import { PlusCircle, Settings, Shirt, WashingMachine, HelpCircle } from "lucide-react";

export default function InicioPage() {
  const { prendas, isLoaded } = usePrendas();

  const armarioCount = useMemo(() => prendas.filter((p) => p.estado === "en_armario").length, [prendas]);
  const lavanderiaCount = useMemo(() => prendas.filter((p) => p.estado === "en_lavanderia").length, [prendas]);
  const perdidasCount = useMemo(() => prendas.filter((p) => p.estado === "perdido").length, [prendas]);

  if (!isLoaded) {
    return <div className="min-h-[100dvh] p-8 text-center text-zinc-400">Cargando...</div>;
  }

  return (
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
          <span className="text-[15px] font-black text-white tabular-nums">{lavanderiaCount}</span>
        </div>
        {perdidasCount > 0 && (
          <div className="col-span-2 flex items-center justify-between rounded-2xl border border-red-400/18 bg-red-400/10 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <HelpCircle size={14} className="text-red-400" />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-200/80">Perdidas</p>
            </div>
            <span className="text-[15px] font-black text-white tabular-nums">{perdidasCount}</span>
          </div>
        )}
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

      {/* Nav shortcuts */}
      <div className="mb-3 px-1">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">Ir a</h2>
      </div>
      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/armario"
          className="flex flex-col items-center gap-3 rounded-[24px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/18 to-sky-600/10 px-4 py-5 text-center transition-all active:scale-[0.97]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-200 shadow-[0_8px_24px_rgba(34,211,238,0.18)]">
            <Shirt size={26} strokeWidth={1.8} />
          </div>
          <div>
            <span className="block text-base font-black text-white">Armario</span>
            <span className="text-[11px] font-semibold text-cyan-200/70">
              {armarioCount} prenda{armarioCount !== 1 ? "s" : ""}
            </span>
          </div>
        </Link>

        <Link
          href="/lavanderia"
          className="flex flex-col items-center gap-3 rounded-[24px] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/18 to-teal-600/10 px-4 py-5 text-center transition-all active:scale-[0.97]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200 shadow-[0_8px_24px_rgba(52,211,153,0.18)]">
            <WashingMachine size={26} strokeWidth={1.8} />
          </div>
          <div>
            <span className="block text-base font-black text-white">Lavandería</span>
            <span className="text-[11px] font-semibold text-emerald-200/70">
              {lavanderiaCount} prenda{lavanderiaCount !== 1 ? "s" : ""}
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
