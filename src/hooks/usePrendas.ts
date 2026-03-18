"use client";

import { useState, useEffect } from "react";
import { Prenda } from "@/types";

export function usePrendas() {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("micolada_prendas");
      if (saved) {
        try {
          // eslint-disable-next-line
          setPrendas(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse prendas from localStorage", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("micolada_prendas", JSON.stringify(prendas));
    }
  }, [prendas, isLoaded]);

  const addPrenda = (prenda: Omit<Prenda, "id" | "estado" | "fechaEnvio">) => {
    // Fallback ID generation when crypto.randomUUID is unavailable (e.g., localhost without HTTPS)
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
      
    const newPrenda: Prenda = {
      ...prenda,
      id: newId,
      estado: "en_armario",
    };
    setPrendas((prev) => [newPrenda, ...prev]);
  };

  const sendToLaundry = (items: {id: string, qty: number}[]) => {
    setPrendas((prev) =>
      prev.map((p) => {
        const found = items.find(i => i.id === p.id);
        return found
          ? { ...p, estado: "en_lavanderia", fechaEnvio: Date.now(), cantidadEnviada: found.qty }
          : p;
      })
    );
  };

  const receiveFromLaundry = (id: string) => {
    setPrendas((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, estado: "en_armario", fechaEnvio: undefined, cantidadEnviada: undefined }
          : p
      )
    );
  };

  const updatePrenda = (id: string, updates: Partial<Prenda>) => {
    setPrendas(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removePrenda = (id: string) => {
    setPrendas((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    prendas,
    isLoaded,
    addPrenda,
    sendToLaundry,
    receiveFromLaundry,
    removePrenda,
    updatePrenda,
  };
}
