"use client";

import * as React from "react";
import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";

export interface MosaicItem {
  id: string;
  title: string;
  image?: string;
  name: string;
  role: string;
  href: string;
}

export interface FeatureMosaicProps {
  featured?: MosaicItem;
  tiles?: MosaicItem[];
}

export function FeatureMosaic({ featured, tiles = [] }: FeatureMosaicProps) {
  // Setup Embla for the drifting rail
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    align: "start",
    containScroll: false,
  });

  // Implement smooth ambient horizontal drift that pauses on hover
  useEffect(() => {
    if (!emblaApi) return;

    let animationId: number;
    let isHovered = false;

    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    const engine = emblaApi.internalEngine();
    
    // Smooth continuous scroll loop
    const scroll = () => {
      if (!isHovered && !prefersReducedMotion) {
        // Slowly advance location
        engine.location.add(0.4);
        engine.target.set(engine.location);
        engine.scrollLooper.loop(-1);
        engine.slideLooper.loop();
        engine.translate.to(engine.location.get());
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const container = emblaApi.containerNode();
    
    const handleMouseEnter = () => {
      isHovered = true;
    };
    const handleMouseLeave = () => {
      isHovered = false;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      mediaQuery.removeEventListener("change", handleMotionChange);
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [emblaApi]);

  // Group tiles into columns of 2 to create the double-row grid effect
  const columns: MosaicItem[][] = [];
  for (let i = 0; i < tiles.length; i += 2) {
    columns.push(tiles.slice(i, i + 2));
  }

  // Render helper for single tile content
  const renderTileMedia = (tile: MosaicItem, isLarge = false) => {
    const aspectClass = isLarge ? "aspect-[4/5]" : "aspect-[4/3]";
    if (tile.image) {
      return (
        <div className={`relative overflow-hidden ${aspectClass} border border-line bg-paper-2`}>
          <Image
            src={tile.image}
            alt={tile.title}
            fill
            sizes={isLarge ? "33vw" : "20vw"}
            className="object-cover grayscale contrast-110 transition-all duration-300 hover:grayscale-0 hover:contrast-100"
          />
        </div>
      );
    }

    // Ruled typographic fallback
    return (
      <div className={`flex flex-col justify-between p-4 border border-line bg-paper-2 ${aspectClass}`}>
        <p className="eyebrow text-[10px]">No image</p>
        <span className="font-display text-h3 italic leading-tight text-ink text-center line-clamp-3">
          {tile.title}
        </span>
        <div className="w-6 h-px bg-line mx-auto" />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-8 border-y border-line reveal">
      {/* Featured (large) tile at left */}
      {featured && (
        <div className="lg:col-span-4 space-y-3 group">
          <Link href={featured.href} className="block">
            {renderTileMedia(featured, true)}
          </Link>
          <div className="space-y-1">
            <h3 className="font-display text-h3 leading-tight group-hover:text-accent transition-colors">
              <Link href={featured.href}>{featured.title}</Link>
            </h3>
            <p className="eyebrow text-[11px]">
              {featured.name} <span className="text-line mx-1">·</span> {featured.role}
            </p>
          </div>
        </div>
      )}

      {/* Drifting rail of smaller tiles at right */}
      <div className={`lg:col-span-8 overflow-hidden`} ref={emblaRef}>
        <div className="flex gap-6 select-none">
          {columns.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-6 shrink-0 w-[240px] md:w-[280px]">
              {column.map((tile) => (
                <div key={tile.id} className="space-y-2 group">
                  <Link href={tile.href} className="block">
                    {renderTileMedia(tile, false)}
                  </Link>
                  <div className="space-y-0.5">
                    <h4 className="font-display text-body leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      <Link href={tile.href}>{tile.title}</Link>
                    </h4>
                    <p className="eyebrow text-[10px] truncate">
                      {tile.name} <span className="text-line mx-0.5">·</span> {tile.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
