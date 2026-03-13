"use client";
import clsx from "clsx";
import { getColorStyle, getColorName } from "@/utils/colors";
import { getEmojiForTipo } from "@/utils/icons";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  isColorChip?: boolean;
}

export default function Chip({ label, selected, onClick, isColorChip }: ChipProps) {
  const colorStyle = isColorChip ? getColorStyle(label) : null;
  const displayName = isColorChip ? getColorName(label) : label;

  return (
    <button
      type="button"
      onClick={onClick}
      style={
        isColorChip 
          ? {
              background: selected ? colorStyle!.background : "rgba(255,255,255,0.05)",
              color: selected ? colorStyle!.color : "#cbd5e1",
              borderColor: selected ? (colorStyle!.border || 'rgba(255,255,255,0.2)') : "rgba(255,255,255,0.1)"
            }
          : undefined
      }
      className={clsx(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out hover:-translate-y-1 active:scale-95 inline-flex whitespace-nowrap items-center gap-2",
        !isColorChip && selected && "bg-cyan-500 text-white shadow-md shadow-cyan-500/40 border-transparent",
        !isColorChip && !selected && "bg-white/5 text-zinc-300 border border-white/10 hover:border-white/20 hover:bg-white/10",
        isColorChip && "border",
        isColorChip && selected && "shadow-md shadow-black/30",
        isColorChip && !selected && "hover:bg-white/10"
      )}
    >
      {isColorChip ? (
        <span 
          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-inner" 
          style={{ background: colorStyle!.background }} 
        />
      ) : (
        getEmojiForTipo(label, "w-5 h-5")
      )}
      {displayName}
    </button>
  );
}
