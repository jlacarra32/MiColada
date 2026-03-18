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
  "Sábana"
];

export const BAG_TIPOS = ["Interior", "Calcetines"];
export function isBagType(tipo: string): boolean {
  return BAG_TIPOS.some(b => tipo.toLowerCase().includes(b.toLowerCase()));
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
  "Estampado"
];

export function useConfig() {
  const [tipos, setTipos] = useState<string[]>([]);
  const [colores, setColores] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTipos = localStorage.getItem("micolada_tipos");
      const savedColores = localStorage.getItem("micolada_colores");
      
      if (savedTipos) {
        try {
          // eslint-disable-next-line
          setTipos(JSON.parse(savedTipos));
        } catch (e) {
          setTipos(DEFAULT_TIPOS);
        }
      } else {
        setTipos(DEFAULT_TIPOS);
      }

      if (savedColores) {
        try {
          // eslint-disable-next-line
          setColores(JSON.parse(savedColores));
        } catch (e) {
          setColores(DEFAULT_COLORES);
        }
      } else {
        setColores(DEFAULT_COLORES);
      }
      
      setIsLoaded(true);
    }
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
      setTipos(prev => [...prev, raw]);
    }
  };

  const removeTipo = (t: string) => {
    setTipos(prev => prev.filter(item => item !== t));
  };

  const addColor = (c: string) => {
    const raw = c.trim();
    if (raw && !colores.includes(raw)) {
      setColores(prev => [...prev, raw]);
    }
  };

  const removeColor = (c: string) => {
    setColores(prev => prev.filter(item => item !== c));
  };

  return {
    tipos,
    colores,
    isLoaded,
    addTipo,
    removeTipo,
    addColor,
    removeColor
  };
}
