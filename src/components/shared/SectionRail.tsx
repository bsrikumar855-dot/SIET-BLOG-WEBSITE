"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type SectionRailProps = {
  eyebrow: string;
  title: string;
  count: number;
  countLabel: string;
  exploreHref: string;
  exploreLabel: string;
  children: ReactNode;
};

export function SectionRail({
  eyebrow,
  title,
  count,
  countLabel,
  exploreHref,
  exploreLabel,
  children,
}: SectionRailProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });

  return (
    <section className="section-rail reveal">
      <header>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="counter">
            {count} {countLabel}
          </p>
        </div>
        <Link className="explore-link" href={exploreHref}>
          {exploreLabel} <span>→</span>
        </Link>
      </header>
      <div className="section-rail-window" ref={emblaRef}>
        <div className="section-rail-track">
          {Array.isArray(children)
            ? children.map((child, index) => (
                <div className="section-rail-slide" key={index}>
                  {child}
                </div>
              ))
            : children}
        </div>
      </div>
      <div className="section-rail-controls">
        <button aria-label="Previous items" onClick={() => emblaApi?.scrollPrev()} type="button">
          <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.5} />
        </button>
        <button aria-label="Next items" onClick={() => emblaApi?.scrollNext()} type="button">
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
