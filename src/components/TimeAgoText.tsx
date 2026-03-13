"use client";

import { useEffect, useState } from "react";

export default function TimeAgoText({ timestamp }: { timestamp: number }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const updateText = () => {
      const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) setText(`Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`);
      else if (diffInHours > 0) setText(`Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`);
      else if (diffInMinutes > 0) setText(`Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`);
      else setText("Justo ahora");
    };

    updateText();
    // Update every minute (60000ms)
    const interval = setInterval(updateText, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!text) return null;

  return (
    <p className="text-xs text-[var(--color-laundry-alert)] font-medium mt-1">
      {text}
    </p>
  );
}
