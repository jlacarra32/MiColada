"use client";
import { Prenda } from "@/types";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { getColorName, getColorStyle } from "@/utils/colors";
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
  smallPreviewIcon?: boolean;
  hideTipoLabel?: boolean;
}

export default function PrendaCard({
  prenda,
  selected,
  selectedQty,
  onClick,
  onQtyChange,
  onEditClick,
  actionButton,
  children,
  compact = false,
  smallPreviewIcon = false,
  hideTipoLabel = false,
}: Props) {
  const colorStyle = getColorStyle(prenda.color);
  const colorName = getColorName(prenda.color);
  const textColor = colorStyle.isDark ? "text-white" : "text-black";
  const mutedText = colorStyle.isDark ? "text-white/70" : "text-black/60";
  const iconBg = colorStyle.isDark ? "bg-white/10" : "bg-black/5";

  const iconSize = compact ? (smallPreviewIcon ? "h-7 w-7" : "h-8 w-8") : smallPreviewIcon ? "h-7 w-7" : "h-8 w-8";
  const containerIconSize = compact ? (smallPreviewIcon ? "h-11 w-11" : "h-12 w-12") : smallPreviewIcon ? "h-11 w-11" : "h-12 w-12";
  const title = prenda.detalle ? `\"${prenda.detalle}\"` : hideTipoLabel ? colorName || prenda.tipo : prenda.tipo;

  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        background: colorStyle.background,
        borderColor: colorStyle.border || "rgba(255,255,255,0.1)",
      }}
      className={clsx(
        "group/card relative flex flex-col items-center overflow-hidden rounded-[28px] border text-center transition-all duration-300 ease-out",
        compact ? "gap-1 p-3" : "gap-1.5 p-4",
        onClick && "cursor-pointer active:scale-[0.985]",
        selected ? "ring-2 ring-cyan-300/90 shadow-[0_12px_28px_rgba(34,211,238,0.24)]" : "shadow-[0_10px_24px_rgba(0,0,0,0.14)]",
        textColor
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px] opacity-[0.05]" />

      <div className="relative flex w-full flex-col items-center">
        <div className={clsx(containerIconSize, "relative mx-auto mb-1.5 flex items-center justify-center")}>
          <div className="absolute inset-0 scale-125 rounded-full bg-white/10 blur-xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />

          <div className={clsx("flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-white/12 transition-transform duration-500 group-hover/card:scale-105", iconBg)}>
            {getEmojiForTipo(prenda.tipo, iconSize)}
          </div>

          {prenda.estado === "en_lavanderia" && (
            <div className="absolute -right-0.5 -top-0.5 z-20 rounded-full border-2 border-zinc-900 bg-emerald-500 p-0.5 text-white shadow-lg">
              <CheckCircle2 size={9} strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <h3 className={clsx("line-clamp-1 px-0.5 leading-tight", compact ? "text-[12px] font-bold" : "text-sm font-semibold")}>{title}</h3>

          {prenda.detalle && !hideTipoLabel && (
            <p className={clsx("font-black uppercase tracking-[0.16em] opacity-45", mutedText, compact ? "text-[8px]" : "text-[10px]")}>
              {prenda.tipo}
            </p>
          )}

          {colorName && (
            <span
              className={clsx(
                "mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                colorStyle.isDark ? "bg-white/14 text-white/80" : "bg-black/10 text-black/65"
              )}
            >
              {colorName}
            </span>
          )}

          {prenda.estado === "en_lavanderia" && prenda.cantidadEnviada && prenda.cantidadEnviada > 1 && (
            <div
              className={clsx(
                "mt-1 flex items-center gap-0.5 rounded-full px-2 py-1 font-bold uppercase tracking-[0.14em]",
                compact ? "text-[8px]" : "text-[10px]",
                colorStyle.isDark ? "bg-white/15 text-white/80" : "bg-black/10 text-black/60"
              )}
            >
              x{prenda.cantidadEnviada}
            </div>
          )}
        </div>

        {selected && prenda.esMultiple && onQtyChange && selectedQty !== undefined && (
          <div className="mt-2 flex w-full items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQtyChange(Math.max(1, selectedQty - 1));
              }}
              disabled={selectedQty <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-black/20 text-white/80 transition-all active:scale-90 disabled:opacity-30"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center text-sm font-black tabular-nums">{selectedQty}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQtyChange(selectedQty + 1);
              }}
              disabled={selectedQty >= 10}
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20 text-white transition-all active:scale-90 disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>
        )}

        {children && <div className="mt-1.5 w-full">{children}</div>}
      </div>

      {selected && (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-cyan-400 p-1 text-white shadow-lg shadow-cyan-500/35">
          <CheckCircle2 size={11} strokeWidth={3} />
        </div>
      )}

      {onEditClick && !selected && (
        <button
          type="button"
          aria-label={`Editar ${prenda.tipo}`}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          className="absolute left-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white/70 transition-all hover:bg-black/50 hover:text-white"
        >
          <div className="flex gap-0.5">
            <span className="h-0.5 w-0.5 rounded-full bg-current"></span>
            <span className="h-0.5 w-0.5 rounded-full bg-current"></span>
            <span className="h-0.5 w-0.5 rounded-full bg-current"></span>
          </div>
        </button>
      )}

      {actionButton && <div className="z-20 mt-1.5 w-full">{actionButton}</div>}
    </div>
  );
}
