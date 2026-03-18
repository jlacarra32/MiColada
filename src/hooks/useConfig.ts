"use client";

import { useState, useEffect } from "react";

const DEFAULT_TIPOS = [
  "Camiseta",
  "Sudadera",
  "Pantalón largo",
  "Vaquero largo",
  "Pantalón corto",
  "Ropa de Deporte",
  "Interior",
  "Calcetines",
  "Toalla",
  "Sábana",
];

export const BAG_TIPOS = ["Interior", "Calcetines"];
export function isBagType(tipo: string): boolean {
  return BAG_TIPOS.some((b) => tipo.toLowerCase().includes(b.toLowerCase()));
}

const DEFAULT_COLORES = [
  "Blanco",
  "Negro",
  "Gris",
  "Azul",
  "Azul Marino",
  "Rojo",
  "Verde",
  "Amarillo",
  "Beige",
  "Multicolor",
  "Estampado",
];

function loadStoredList(key: string, fallback: string[]) {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;

  try {
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

export function useConfig() {
  const [tipos, setTipos] = useState<string[]>(DEFAULT_TIPOS);
  const [colores, setColores] = useState<string[]>(DEFAULT_COLORES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTipos(loadStoredList("micolada_tipos", DEFAULT_TIPOS));
      setColores(loadStoredList("micolada_colores", DEFAULT_COLORES));
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("micolada_tipos", JSON.stringify(tipos));
      localStorage.setItem("micolada_colores", JSON.stringify(colores));
    }
  }, [tipos, colores, isLoaded]);

  const addTipo = (t: string) => {
    const raw = t.trim();
    if (raw && !tipos.includes(raw)) {
      setTipos((prev) => [...prev, raw]);
    }
  };

  const removeTipo = (t: string) => {
    setTipos((prev) => prev.filter((item) => item !== t));
  };

  const addColor = (c: string) => {
    const raw = c.trim();
    if (raw && !colores.includes(raw)) {
      setColores((prev) => [...prev, raw]);
    }
  };

  const removeColor = (c: string) => {
    setColores((prev) => prev.filter((item) => item !== c));
  };

  return {
    tipos,
    colores,
    isLoaded,
    addTipo,
    removeTipo,
    addColor,
    removeColor,
  };
}
