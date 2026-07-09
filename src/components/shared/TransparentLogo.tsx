"use client";

import { useEffect, useRef, useState } from "react";

interface TransparentLogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function TransparentLogo({
  src,
  alt,
  width = 34,
  height = 34,
  className = "",
}: TransparentLogoProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Loop through pixels and make white/near-white pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If the pixel is very close to white (near-white), set alpha to 0
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSrc(canvas.toDataURL("image/png"));
    };
  }, [src]);

  if (!processedSrc) {
    return <div className="animate-pulse bg-neutral-200 rounded-xs" style={{ width, height }} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={processedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
