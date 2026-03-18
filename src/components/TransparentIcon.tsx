"use client";

import React, { useEffect, useState } from 'react';

/**
 * Advanced background removal with global cache.
 * Analyzes the corners to detect the background color and removes it with a fuzz factor.
 * Processed images are cached globally to avoid re-processing on re-renders.
 */

// Global cache for processed icons — persists across component instances and re-renders
const iconCache = new Map<string, string>();

interface TransparentIconProps {
  src: string;
  alt: string;
  className?: string;
}

export const TransparentIcon = ({ src, alt, className }: TransparentIconProps) => {
  const [processedSrc, setProcessedSrc] = useState<string | null>(() => {
    // Check cache synchronously on mount
    return iconCache.get(src) || null;
  });

  useEffect(() => {
    // If already cached, set immediately and skip processing
    if (iconCache.has(src)) {
      setProcessedSrc(iconCache.get(src)!);
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample corners to get the likely background color
      const corners = [
        [0, 0], [canvas.width - 1, 0], [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1]
      ];
      
      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR /= 4; bgG /= 4; bgB /= 4;

      const threshold = 60;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const diff = Math.sqrt(
          Math.pow(r - bgR, 2) + 
          Math.pow(g - bgG, 2) + 
          Math.pow(b - bgB, 2)
        );

        if (diff < threshold) {
          data[i + 3] = 0;
        } else if (diff < threshold * 1.5) {
          data[i + 3] = ((diff - threshold) / (threshold * 0.5)) * 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL();
      
      // Store in global cache
      iconCache.set(src, dataUrl);
      
      if (isMounted) {
        setProcessedSrc(dataUrl);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div className={className || "w-10 h-10 relative flex items-center justify-center shrink-0"}>
      {processedSrc ? (
        <img 
          src={processedSrc} 
          alt={alt} 
          className="w-full h-full object-contain scale-110 drop-shadow-md"
        />
      ) : (
        <div className="w-full h-full bg-white/10 animate-pulse rounded-full" />
      )}
    </div>
  );
};
