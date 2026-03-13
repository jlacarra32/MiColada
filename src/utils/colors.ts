export function getColorName(colorString: string): string {
  if (!colorString) return "";
  return colorString.split('|')[0].trim();
}

export function getColorStyle(colorString: string): { background: string; color: string; border?: string; isDark?: boolean } {
  if (!colorString) return { background: "#ffffff", color: "#333333", border: "#e2e8f0", isDark: false };
  
  const parts = colorString.split('|');
  const normalized = parts[0].toLowerCase().trim();
  const hexCode = parts[1];

  if (hexCode) {
    return { background: hexCode, color: "#ffffff", border: "rgba(0,0,0,0.1)", isDark: true };
  }
  
  if (normalized.includes("blanco")) return { background: "#ffffff", color: "#333333", border: "#e2e8f0", isDark: false };
  if (normalized.includes("negro")) return { background: "#262626", color: "#ffffff", isDark: true };
  if (normalized.includes("gris")) return { background: "#a3a3a3", color: "#ffffff", isDark: true };
  if (normalized === "azul marino") return { background: "#1e3a8a", color: "#ffffff", isDark: true };
  if (normalized.includes("azul")) return { background: "#3b82f6", color: "#ffffff", isDark: true };
  if (normalized.includes("rojo")) return { background: "#ef4444", color: "#ffffff", isDark: true };
  if (normalized.includes("verde")) return { background: "#22c55e", color: "#ffffff", isDark: true };
  if (normalized.includes("amarillo")) return { background: "#eab308", color: "#ffffff", isDark: true };
  if (normalized.includes("beige")) return { background: "#fef3c7", color: "#92400e", border: "#fde68a", isDark: false };
  if (normalized.includes("multicolor")) return { background: "linear-gradient(45deg, #ef4444, #eab308, #22c55e, #3b82f6)", color: "#ffffff", isDark: true };
  if (normalized.includes("estampado")) return { background: "repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #e5e7eb 10px, #e5e7eb 20px)", color: "#333333", border: "#d1d5db", isDark: false };

  // Generate hash color as fallback
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return {
    background: `hsl(${h}, 70%, 65%)`,
    color: "#ffffff",
    isDark: true
  };
}
