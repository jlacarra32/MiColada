"use client";
import { Prenda } from "@/types";
import { 
  CheckCircle2, 
  Minus,
  Plus,
} from "lucide-react";
import clsx from "clsx";
import { getColorStyle } from "@/utils/colors";
import { getEmojiForTipo } from "@/utils/icons";

interface Props {
  prenda: Prenda;
  selected?: boolean;
  selectedQty?: number;
  onClick?: () => void;
  onQtyChange?: (qty: number) => void;
  onEditClick?: () => void;
  actionButton?: React.ReactNode;
  children?: React.ReactNode;
  compact?: boolean;
}

export default function PrendaCard({ prenda, selected, selectedQty, onClick, onQtyChange, onEditClick, actionButton, children, compact = false }: Props) {
  const colorStyle = getColorStyle(prenda.color);
  const textColor = colorStyle.isDark ? "text-white" : "text-black";
  const mutedText = colorStyle.isDark ? "text-white/70" : "text-black/60";
  const iconBg = colorStyle.isDark ? "bg-white/10" : "bg-black/5";

  const iconSize = compact ? "w-8 h-8" : "w-9 h-9";
  const containerIconSize = compact ? "w-10 h-10" : "w-11 h-11";

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colorStyle.background,
        borderColor: colorStyle.border || 'rgba(255,255,255,0.1)',
      }}
      className={clsx(
        "rounded-2xl flex flex-col items-center text-center transition-all duration-300 ease-in-out relative border overflow-hidden group/card",
        compact ? "p-2 gap-0.5" : "p-3 gap-1",
        onClick && "cursor-pointer active:scale-[0.96] hover:shadow-xl hover:-translate-y-0.5",
        selected ? "ring-3 ring-cyan-400 shadow-cyan-500/40" : "shadow-sm shadow-black/10",
        textColor
      )}
    >
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:8px_8px]" />

      <div className="relative w-full flex flex-col items-center">
        {/* Icon Container */}
        <div className={clsx(containerIconSize, "mx-auto mb-1 relative flex items-center justify-center")}>
          <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-125 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
          
          <div className={clsx("w-full h-full rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover/card:scale-110", iconBg)}>
             {getEmojiForTipo(prenda.tipo, iconSize)}
          </div>

          {prenda.estado === "en_lavanderia" && (
            <div className="absolute -top-0.5 -right-0.5 z-20 bg-emerald-500 text-white rounded-full p-0.5 shadow-lg border-2 border-zinc-900">
              <CheckCircle2 size={8} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-center">
          {prenda.detalle ? (
            <h3 className={clsx("font-extrabold leading-tight line-clamp-1 px-0.5", compact ? "text-[11px]" : "text-sm")}>
              &quot;{prenda.detalle}&quot;
            </h3>
          ) : (
            <h3 className={clsx("font-bold leading-tight line-clamp-1 opacity-90", compact ? "text-[10px]" : "text-xs")}>
              {prenda.tipo}
            </h3>
          )}
          
          {prenda.detalle && (
            <p className={clsx("uppercase tracking-[0.1em] font-black opacity-40", mutedText, compact ? "text-[7px]" : "text-[9px]")}>
              {prenda.tipo}
            </p>
          )}

          {/* Quantity sent badge (only visible if sent) */}
          {prenda.estado === "en_lavanderia" && prenda.cantidadEnviada && prenda.cantidadEnviada > 1 && (
            <div className={clsx(
              "mt-0.5 px-1.5 py-0 rounded-full font-bold uppercase tracking-wider flex items-center gap-0.5",
              compact ? "text-[7px]" : "text-[8px]",
              colorStyle.isDark ? "bg-white/15 text-white/80" : "bg-black/10 text-black/60"
            )}>
              ×{prenda.cantidadEnviada}
            </div>
          )}
        </div>

        {/* Quantity selector for multiple items when selected */}
        {selected && prenda.esMultiple && onQtyChange && selectedQty !== undefined && (
          <div className="mt-1 w-full flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onQtyChange(Math.max(1, selectedQty - 1)); }}
              disabled={selectedQty <= 1}
              className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-white/80 transition-all active:scale-90 disabled:opacity-30"
            >
              <Minus size={12} />
            </button>
            <span className="w-5 text-center font-black text-sm tabular-nums">{selectedQty}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onQtyChange(selectedQty + 1); }}
              disabled={selectedQty >= 10}
              className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white transition-all active:scale-90 disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>
        )}
        
        {children && <div className="mt-0.5 w-full">{children}</div>}
      </div>

      {selected && (
        <div className="absolute top-1.5 right-1.5 text-white animate-in zoom-in duration-300 bg-cyan-500 rounded-full p-0.5 shadow-lg z-20">
          <CheckCircle2 size={10} strokeWidth={3} />
        </div>
      )}

      {onEditClick && !selected && (
        <button
          onClick={(e) => { e.stopPropagation(); onEditClick(); }}
          className="absolute top-1.5 left-1.5 z-20 w-5 h-5 bg-black/30 backdrop-blur-sm text-white/70 hover:text-white rounded-full flex items-center justify-center transition-all hover:bg-black/50"
        >
          <div className="flex gap-0.5">
            <span className="w-0.5 h-0.5 rounded-full bg-current"></span>
            <span className="w-0.5 h-0.5 rounded-full bg-current"></span>
            <span className="w-0.5 h-0.5 rounded-full bg-current"></span>
          </div>
        </button>
      )}

      {actionButton && (
        <div className="mt-1 w-full z-20">
          {actionButton}
        </div>
      )}
    </div>
  );
}
