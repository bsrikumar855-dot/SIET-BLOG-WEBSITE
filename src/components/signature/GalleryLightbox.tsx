"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface GalleryLightboxProps {
  images: string[];
}

export function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeImage) return;

    // Focus the modal when opened
    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
      if (e.key === "Tab") {
        const modalElement = modalRef.current;
        if (!modalElement) return;
        
        // Find all focusable elements within the modal
        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage]);

  const openLightbox = (imgUrl: string, btnElement: HTMLButtonElement) => {
    triggerRef.current = btnElement;
    setActiveImage(imgUrl);
  };

  const closeLightbox = () => {
    setActiveImage(null);
    // Restore focus to the initiating button
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3 my-8">
      <h4 className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">Project Gallery</h4>
      
      {/* Grid of gallery images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imgUrl, idx) => {
          return (
            <button
              key={idx}
              onClick={(e) => openLightbox(imgUrl, e.currentTarget)}
              className="relative aspect-4/3 w-full overflow-hidden border border-line bg-paper-2 hover:border-accent transition-colors group cursor-zoom-in"
              aria-label={`Enlarge gallery image ${idx + 1}`}
            >
              <Image
                src={imgUrl}
                alt={`Gallery image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          tabIndex={-1}
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper/95 p-4 md:p-8 backdrop-blur-sm outline-none"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-5xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-0 right-0 z-10 p-2 font-util text-eyebrow text-ink hover:text-accent transition-colors border border-line bg-paper text-sm uppercase tracking-wider"
              aria-label="Close lightbox"
            >
              Close [Esc]
            </button>

            {/* Enlarge Image */}
            <div className="relative border border-line bg-paper max-h-[85vh] max-w-full overflow-hidden">
              <img
                src={activeImage}
                alt="Enlarged view"
                className="max-h-[80vh] max-w-full object-contain grayscale"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
