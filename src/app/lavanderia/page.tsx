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
  const { prendas, isLoaded, receiveFromLaundry } = usePrendas();
  const [toast, setToast] = useState({ visible: false, message: "" });
  
  const lavanderiaPrendas = useMemo(
    () => prendas
      .filter((p) => p.estado === "en_lavanderia")
      .sort((a, b) => (b.fechaEnvio || 0) - (a.fechaEnvio || 0)),
    [prendas]
  );

  const closeToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  const handleReceiveAll = useCallback(() => {
    const count = lavanderiaPrendas.length;
    lavanderiaPrendas.forEach((p) => receiveFromLaundry(p.id));
    setToast({
      visible: true,
      message: `¡${count} prenda${count !== 1 ? "s" : ""} recibida${count !== 1 ? "s" : ""}!`,
    });
  }, [lavanderiaPrendas, receiveFromLaundry]);

  const handleReceiveOne = useCallback((id: string) => {
    receiveFromLaundry(id);
    setToast({
      visible: true,
      message: "¡Prenda recibida!",
    });
  }, [receiveFromLaundry]);

  if (!isLoaded) {
    return <div className="p-8 text-center text-zinc-500 min-h-[100dvh]">Cargando lavanderia...</div>;
  }

  return (
    <div className="min-h-full p-3 pb-28 flex flex-col gap-3">
      <header className="mb-2 mt-5 px-1 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Lavanderia</h1>
          <p className="text-emerald-300/80 font-bold text-[10px] uppercase tracking-widest mt-0.5">
            {lavanderiaPrendas.length} prenda{lavanderiaPrendas.length !== 1 && "s"} lavandose
          </p>
        </div>
        <div className="flex gap-1.5">
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
            No tienes ropa en la lavanderia en este momento.
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
                  className="w-full flex items-center justify-center gap-1 text-emerald-500 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 group font-bold text-[8px] uppercase tracking-wider"
                >
                  <CheckCircle2 size={10} />
                  Recibido
                </button>
              }
            >
              {prenda.fechaEnvio && <TimeAgoText timestamp={prenda.fechaEnvio} />}
            </PrendaCard>
          ))}
        </div>
      )}

      {lavanderiaPrendas.length > 1 && (
        <FAB
          label="Recibir todo"
          onClick={handleReceiveAll}
          icon={<PackageCheck size={20} />}
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
