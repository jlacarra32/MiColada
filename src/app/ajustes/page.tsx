"use client";

import { useState } from "react";
import { useConfig } from "@/hooks/useConfig";
import { Plus, X, ArrowLeft } from "lucide-react";
import { getColorStyle } from "@/utils/colors";
import { getEmojiForTipo } from "@/utils/icons";
import Link from "next/link";

export default function ConfigPage() {
  const { tipos, colores, isLoaded, addTipo, removeTipo, addColor, removeColor } = useConfig();
  
  const [newTipo, setNewTipo] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newHex, setNewHex] = useState("#3b82f6");

  const handleAddTipo = (e: React.FormEvent) => {
    e.preventDefault();
    addTipo(newTipo);
    setNewTipo("");
  };

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.trim()) return;
    addColor(`${newColor.trim()}|${newHex}`);
    setNewColor("");
  };

  if (!isLoaded) return <div className="p-8 text-center text-zinc-500 min-h-[100dvh]">Cargando ajustes...</div>;

  return (
    <div className="min-h-full flex flex-col bg-transparent">
      <header className="p-4 pt-8 px-6 bg-zinc-900/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 shadow-sm flex gap-4 items-start">
        <Link href="/" className="mt-1 p-2 bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-sm shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Ajustes</h1>
          <p className="text-zinc-400 text-sm mt-0.5 font-medium">Personaliza las categorías de tu armario.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 flex flex-col gap-10">
        
        {/* CATEGORIAS */}
        <section>
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Tipos de Prenda</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {tipos.map((t) => (
              <div
                key={t}
                className="bg-zinc-800/80 border border-white/10 text-zinc-200 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm transition-all hover:border-red-500/50 hover:bg-red-500/10 group backdrop-blur-sm"
              >
                {getEmojiForTipo(t, "w-4 h-4")}
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => removeTipo(t)}
                  className="text-zinc-500 group-hover:text-red-400 transition-colors p-1 -mr-1 rounded-full active:scale-90"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTipo} className="flex gap-2 relative">
            <input
              type="text"
              value={newTipo}
              onChange={(e) => setNewTipo(e.target.value)}
              placeholder="Nueva categoría..."
              className="flex-1 px-4 py-3 bg-zinc-800/80 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium text-zinc-100 placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={!newTipo.trim()}
              className="bg-cyan-500 text-white p-3 rounded-xl shadow-md shadow-cyan-500/30 border border-cyan-400/50 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:transform-none"
            >
              <Plus size={20} />
            </button>
          </form>
        </section>

        {/* COLORES */}
        <section>
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Colores / Patrones</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {colores.map((c) => {
              const colorStyle = getColorStyle(c);
              return (
                <div
                  key={c}
                  className="bg-zinc-800/80 border border-white/10 text-zinc-200 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm transition-all hover:border-red-500/50 hover:bg-red-500/10 group backdrop-blur-sm"
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 mr-1 shadow-inner" 
                    style={{ background: colorStyle.background }} 
                  />
                  <span>{c.split('|')[0]}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(c)}
                    className="text-zinc-500 group-hover:text-red-400 transition-colors p-1 -mr-1 rounded-full active:scale-90"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleAddColor} className="flex gap-2 relative items-center bg-zinc-800/80 border border-white/10 rounded-xl p-1 pr-1.5 focus-within:ring-2 focus-within:ring-cyan-500 transition-all shadow-sm">
            <div className="relative shrink-0 overflow-hidden w-10 h-10 rounded-lg ml-1 border border-white/20 box-border bg-black/20">
              <input 
                type="color" 
                value={newHex} 
                onChange={(e) => setNewHex(e.target.value)}
                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0 m-0"
              />
            </div>
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Ej: Fucsia..."
              className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-zinc-100 placeholder:text-zinc-500 w-full"
            />
            <button
              type="submit"
              disabled={!newColor.trim()}
              className="bg-cyan-500 text-white p-2.5 rounded-lg shadow-md shadow-cyan-500/30 border border-cyan-400/50 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:transform-none"
            >
              <Plus size={20} />
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
