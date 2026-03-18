"use client";

import React, { useEffect, useState } from "react";

const iconCache = new Map<string, string>();

interface TransparentIconProps {
  src: string;
  alt: string;
  className?: string;
}

export const TransparentIcon = ({ src, alt, className }: TransparentIconProps) => {
  const cachedSrc = iconCache.get(src) || null;
  const [processedSrc, setProcessedSrc] = useState<string | null>(cachedSrc);

  useEffect(() => {
    if (iconCache.has(src)) {
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const corners = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1],
      ];

      let bgR = 0;
      let bgG = 0;
      let bgB = 0;

      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });

      bgR /= 4;
      bgG /= 4;
      bgB /= 4;

      const threshold = 60;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const diff = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));

        if (diff < threshold) {
          data[i + 3] = 0;
        } else if (diff < threshold * 1.5) {
          data[i + 3] = ((diff - threshold) / (threshold * 0.5)) * 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL();
      iconCache.set(src, dataUrl);

      if (isMounted) {
        setProcessedSrc(dataUrl);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  const finalSrc = processedSrc || cachedSrc;

  return (
    <div className={className || "relative flex h-10 w-10 shrink-0 items-center justify-center"}>
      {finalSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={finalSrc} alt={alt} className="h-full w-full object-contain drop-shadow-md" />
      ) : (
        <div className="h-full w-full animate-pulse rounded-full bg-white/10" />
      )}
    </div>
  );
};
