export function getColorName(colorString: string): string {
  if (!colorString) return "";
  return colorString.split("|")[0].trim();
}

function normalizeHex(hex: string): string | null {
  const clean = hex.trim().replace("#", "");
  if (clean.length === 3) {
    return `#${clean
      .split("")
      .map((char) => char + char)
      .join("")}`;
  }
  if (clean.length === 6) {
    return `#${clean}`;
  }
  return null;
}

function getHexLuminance(hex: string): number {
  const normalized = normalizeHex(hex);
  if (!normalized) return 0;

  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const channels = [r, g, b].map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function getColorStyle(colorString: string): {
  background: string;
  color: string;
  border?: string;
  isDark?: boolean;
} {
  if (!colorString) {
    return { background: "#ffffff", color: "#333333", border: "#e2e8f0", isDark: false };
  }

  const parts = colorString.split("|");
  const normalized = parts[0].toLowerCase().trim();
  const hexCode = parts[1];

  if (hexCode) {
    const luminance = getHexLuminance(hexCode);
    const isDark = luminance < 0.45;
    return {
      background: hexCode,
      color: isDark ? "#ffffff" : "#0f172a",
      border: isDark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.12)",
      isDark,
    };
  }

  if (normalized.includes("blanco")) return { background: "#ffffff", color: "#333333", border: "#e2e8f0", isDark: false };
  if (normalized.includes("negro")) return { background: "#262626", color: "#ffffff", isDark: true };
  if (normalized.includes("gris")) return { background: "#a3a3a3", color: "#111827", border: "rgba(15,23,42,0.14)", isDark: false };
  if (normalized === "azul marino") return { background: "#1e3a8a", color: "#ffffff", isDark: true };
  if (normalized.includes("azul")) return { background: "#3b82f6", color: "#ffffff", isDark: true };
  if (normalized.includes("rojo")) return { background: "#ef4444", color: "#ffffff", isDark: true };
  if (normalized.includes("verde")) return { background: "#22c55e", color: "#052e16", border: "rgba(5,46,22,0.12)", isDark: false };
  if (normalized.includes("amarillo")) return { background: "#eab308", color: "#422006", border: "rgba(66,32,6,0.12)", isDark: false };
  if (normalized.includes("beige")) return { background: "#fef3c7", color: "#92400e", border: "#fde68a", isDark: false };
  if (normalized.includes("multicolor")) return { background: "linear-gradient(45deg, #ef4444, #eab308, #22c55e, #3b82f6)", color: "#ffffff", isDark: true };
  if (normalized.includes("estampado")) return { background: "repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #e5e7eb 10px, #e5e7eb 20px)", color: "#333333", border: "#d1d5db", isDark: false };

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return {
    background: `hsl(${h}, 70%, 65%)`,
    color: "#ffffff",
    isDark: true,
  };
}
