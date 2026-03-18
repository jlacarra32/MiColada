"use client";
import { Prenda } from "@/types";
import { 
  CheckCircle2, 
} from "lucide-react";
import clsx from "clsx";
import { getColorStyle } from "@/utils/colors";
import { getEmojiForTipo } from "@/utils/icons";

interface Props {
  prenda: Prenda;
  selected?: boolean;
  onClick?: () => void;
  actionButton?: React.ReactNode;
  children?: React.ReactNode;
}

const getCategoryIcon = (tipo: string) => {
  return getEmojiForTipo(tipo, "w-12 h-12");
};

export default function PrendaCard({ prenda, selected, onClick, actionButton, children }: Props) {
  const colorStyle = getColorStyle(prenda.color);
  const textColor = colorStyle.isDark ? "text-white" : "text-black";
  const mutedText = colorStyle.isDark ? "text-white/70" : "text-black/60";
  const iconBg = colorStyle.isDark ? "bg-white/10" : "bg-black/5";

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colorStyle.background,
        borderColor: colorStyle.border || 'rgba(255,255,255,0.1)',
      }}
      className={clsx(
        "p-3 rounded-2xl flex flex-col items-center text-center gap-1 transition-all duration-300 ease-in-out relative border overflow-hidden group/card",
        onClick && "cursor-pointer active:scale-[0.96] hover:shadow-xl hover:-translate-y-0.5",
        selected ? "ring-4 ring-cyan-400 shadow-cyan-500/40" : "shadow-sm shadow-black/10",
        textColor
      )}
    >
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:8px_8px]" />

      <div className="relative w-full flex flex-col items-center">
        {/* Integrated Icon Container (No more white coin) */}
        <div className="w-16 h-16 mx-auto mb-2 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-125 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
          
          <div className={clsx("w-full h-full rounded-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover/card:scale-110", iconBg)}>
             {getCategoryIcon(prenda.tipo)}
          </div>

          {prenda.estado === "en_lavanderia" && (
            <div className="absolute -top-1 -right-1 z-20 bg-emerald-500 text-white rounded-full p-1 shadow-lg border-2 border-zinc-900 animate-in zoom-in duration-300">
              <CheckCircle2 size={10} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-center">
          {prenda.detalle ? (
            <h3 className="font-extrabold text-base md:text-lg leading-tight line-clamp-2 px-1 mb-0.5">
              "{prenda.detalle}"
            </h3>
          ) : (
            <h3 className="font-bold text-xs leading-tight line-clamp-2 opacity-90">
              {prenda.tipo}
            </h3>
          )}
          
          {prenda.detalle && (
            <p className={clsx("text-[9px] uppercase tracking-[0.1em] font-black opacity-40", mutedText)}>
              {prenda.tipo}
            </p>
          )}

          {prenda.cantidad && prenda.cantidad > 1 && (
            <div className={clsx(
              "mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1",
              colorStyle.isDark ? "bg-white/15 text-white/90" : "bg-black/10 text-black/70"
            )}>
              <span>×{prenda.cantidad}</span>
              <span>bolsa{prenda.cantidad > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        
        {children && <div className="mt-1 w-full">{children}</div>}
      </div>

      {selected && (
        <div className="absolute top-2 right-2 text-white animate-in zoom-in duration-300 bg-cyan-500 rounded-full p-0.5 shadow-lg z-20">
          <CheckCircle2 size={12} strokeWidth={3} />
        </div>
      )}

      {actionButton && (
        <div className="mt-2 w-full z-20">
          {actionButton}
        </div>
      )}
    </div>
  );
}
