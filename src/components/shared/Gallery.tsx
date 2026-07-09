"use client";

import * as React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  className?: string;
}

/**
 * Responsive Image Grid Gallery with interactive Lightbox zoom viewer.
 */
export function Gallery({ images, className }: GalleryProps) {
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === "Escape") {
        setActiveIdx(null);
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev! + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev! - 1 + images.length) % images.length);
      }
    },
    [activeIdx, images.length]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((prev) => (prev! - 1 + images.length) % images.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((prev) => (prev! + 1) % images.length);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className="group relative aspect-video overflow-hidden rounded-xl bg-muted border border-border/40 cursor-pointer shadow-sm"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay icon */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-md">
                <ZoomIn className="h-5 w-5" />
              </div>
            </div>
            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[11px] text-white font-medium truncate">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Pop-Up Viewer */}
      <AnimatePresence>
        {activeIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Close Button */}
            <button
              onClick={() => setActiveIdx(null)}
              className="absolute top-4 right-4 z-50 rounded-full p-2.5 bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left navigation */}
            <button
              onClick={handlePrev}
              className="absolute left-4 z-50 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main Active image container */}
            <div className="relative w-full max-w-4xl max-h-[80vh] aspect-video mx-8">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative h-full w-full flex items-center justify-center"
              >
                <Image
                  src={images[activeIdx].src}
                  alt={images[activeIdx].alt}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Right navigation */}
            <button
              onClick={handleNext}
              className="absolute right-4 z-50 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Caption HUD indicator */}
            {images[activeIdx].caption && (
              <div className="absolute bottom-6 inset-x-0 text-center max-w-lg mx-auto px-4">
                <p className="text-xs text-white/80 font-medium tracking-wide">
                  {images[activeIdx].caption}
                </p>
                <p className="text-[10px] text-white/40 mt-1 font-mono">
                  {activeIdx + 1} / {images.length}
                </p>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
