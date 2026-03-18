"use client";
import clsx from "clsx";
import { getColorName, getColorStyle } from "@/utils/colors";
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
      aria-pressed={selected}
      style={
        isColorChip
          ? {
              background: selected ? colorStyle!.background : "rgba(255,255,255,0.05)",
              color: selected ? colorStyle!.color : "#cbd5e1",
              borderColor: selected ? colorStyle!.border || "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
            }
          : undefined
      }
      className={clsx(
        "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 ease-out active:scale-95",
        !isColorChip && selected && "border-cyan-300/50 bg-gradient-to-r from-cyan-400 to-sky-500 text-white shadow-[0_10px_25px_rgba(34,211,238,0.25)]",
        !isColorChip && !selected && "border-white/10 bg-white/6 text-zinc-200 hover:border-white/20 hover:bg-white/10",
        isColorChip && "border",
        isColorChip && selected && "shadow-[0_10px_22px_rgba(0,0,0,0.26)]",
        isColorChip && !selected && "hover:bg-white/10"
      )}
    >
      {isColorChip ? (
        <span
          className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/20 shadow-inner"
          style={{ background: colorStyle!.background }}
        />
      ) : (
        getEmojiForTipo(label, "h-5 w-5")
      )}
      {displayName}
    </button>
  );
}
