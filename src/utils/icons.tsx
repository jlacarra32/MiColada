"use client";

import React from 'react';
import { TransparentIcon } from '@/components/TransparentIcon';

/**
 * High-Quality Apple-style Emoji Icons.
 * Using a dedicated Canvas-based background removal for ALL icons.
 */

export function getEmojiForTipo(tipo: string, className?: string): React.ReactNode {
  const norm = tipo.toLowerCase().trim();
  
  // Mapping of clothing types to custom high-quality assets
  const mapping: Record<string, string> = {
    "sudadera": "/icons/hoodie.png",
    "jersey": "/icons/sweater.png",
    "pantalón largo": "/icons/sport-pants.png", // Correct sporty pants for general long pants
    "pantalon largo": "/icons/sport-pants.png",
    "chandal": "/icons/sport-pants.png",
    "chándal": "/icons/sport-pants.png",
    "vaquero": "/icons/jeans.png", // NEW 3D asset for jeans
    "jean": "/icons/jeans.png",
    "camisa": "/icons/shirt.png",
    "camiseta": "/icons/tshirt.png",
    "top": "/icons/top.png",
    "pantalón corto": "/icons/shorts.png",
    "pantalon corto": "/icons/shorts.png",
    "bermuda": "/icons/shorts.png",
    "short": "/icons/shorts.png",
    "toalla": "/icons/towel.png",
    "sábana": "/icons/bedding.png",
    "sabana": "/icons/bedding.png",
    "manta": "/icons/bedding.png",
    "interior": "/icons/underwear.png",
    "calzoncillos": "/icons/underwear.png",
    "bragas": "/icons/underwear.png",
    "calcetines": "/icons/socks.png",
    "media": "/icons/socks.png",
    "vestido": "/icons/dress.png",
    "falda": "/icons/dress.png",
    "bañador": "/icons/swimwear.png",
    "bikini": "/icons/swimwear.png",
    "deporte": "/icons/sport-suit.png",
    "ropa de deporte": "/icons/sport-suit.png",
    "deportiva": "/icons/sport-suit.png",
    "gym": "/icons/sport-suit.png",
    "malla": "/icons/sport-suit.png",
    "pijama": "/icons/pajamas.png"
  };

  for (const [key, src] of Object.entries(mapping)) {
    if (norm.includes(key)) {
      if (key === "camisa" && norm.includes("camiseta")) continue;
      return <TransparentIcon src={src} alt={tipo} className={className} />;
    }
  }

  // Fallback
  return <span className={className || "text-2xl leading-none select-none"}>👕</span>;
}
