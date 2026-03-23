"use client";

import { useState, useEffect } from "react";
import { Prenda } from "@/types";

function loadStoredPrendas() {
  const saved = localStorage.getItem("micolada_prendas");
  if (!saved) return [] as Prenda[];

  try {
    return JSON.parse(saved) as Prenda[];
  } catch (error) {
    console.error("Failed to parse prendas from localStorage", error);
    return [] as Prenda[];
  }
}

export function usePrendas() {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let stored = loadStoredPrendas();
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      let hasChanges = false;
      
      stored = stored.map((p) => {
        if (p.estado === "en_lavanderia" && p.fechaEnvio && now - p.fechaEnvio > SEVEN_DAYS_MS) {
          hasChanges = true;
          return { ...p, estado: "perdido" };
        }
        return p;
      });

      setPrendas(stored);
      setIsLoaded(true);
      if (hasChanges) {
        localStorage.setItem("micolada_prendas", JSON.stringify(stored));
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("micolada_prendas", JSON.stringify(prendas));
    }
  }, [prendas, isLoaded]);

  const addPrenda = (prenda: Omit<Prenda, "id" | "estado" | "fechaEnvio">) => {
    const newId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

    const newPrenda: Prenda = {
      ...prenda,
      id: newId,
      estado: "en_armario",
    };
    setPrendas((prev) => [newPrenda, ...prev]);
  };

  const sendToLaundry = (items: { id: string; qty: number }[]) => {
    const itemsMap = new Map(items.map((item) => [item.id, item.qty]));
    setPrendas((prev) =>
      prev.map((p) => {
        const qty = itemsMap.get(p.id);
        return qty
          ? { ...p, estado: "en_lavanderia", fechaEnvio: Date.now(), cantidadEnviada: qty }
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

  const receiveManyFromLaundry = (ids: string[]) => {
    const idsSet = new Set(ids);
    setPrendas((prev) =>
      prev.map((p) =>
        idsSet.has(p.id)
          ? { ...p, estado: "en_armario", fechaEnvio: undefined, cantidadEnviada: undefined }
          : p
      )
    );
  };

  const updatePrenda = (id: string, updates: Partial<Prenda>) => {
    setPrendas((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const markAsLost = (id: string) => {
    setPrendas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: "perdido" } : p))
    );
  };

  const markAsFound = (id: string) => {
    setPrendas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: "en_armario", fechaEnvio: undefined, cantidadEnviada: undefined } : p))
    );
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
    receiveManyFromLaundry,
    markAsLost,
    markAsFound,
    removePrenda,
    updatePrenda,
  };
}
