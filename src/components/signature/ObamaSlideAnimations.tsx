"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface SlideItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  category: string;
  description: string;
}

// 1. STICKY CARD STACK COMPONENT
interface ObamaCardStackProps {
  slides: SlideItem[];
}

export function ObamaCardStack({ slides }: ObamaCardStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(800);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Scroll position relative to the container top
      const scrolled = -rect.top;
      setScrollTop(scrolled);

      // Determine active slide index
      const index = Math.max(
        0,
        Math.min(
          slides.length - 1,
          Math.floor((scrolled + window.innerHeight / 2) / window.innerHeight)
        )
      );
      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slides.length]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${slides.length * 100}vh` }}
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-paper flex flex-col justify-between">
        {/* Active Counter Header */}
        <div className="absolute top-8 left-8 z-30 font-util text-eyebrow text-ink tracking-widest flex items-center gap-4">
          <span className="font-semibold text-accent text-sm">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-line" />
          <span className="text-ink-soft">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* Floating Category Label */}
        <div className="absolute top-8 right-8 z-30 font-util text-eyebrow text-ink-soft uppercase tracking-wider">
          {slides[activeIndex]?.category}
        </div>

        {/* Stack of Cards */}
        <div className="relative w-full h-full">
          {slides.map((slide, idx) => {
            // Calculate progress of this slide's exit
            // 0 when slide is active and not scrolled past
            // 1 when slide is fully scrolled past (covered by next slide)
            const slideStart = idx * windowHeight;
            const progress = Math.max(
              0,
              Math.min(1, (scrollTop - slideStart) / windowHeight)
            );

            // Parallax translations
            const textTranslateY = -progress * 150; // Text slides up
            const imgScale = 1 + progress * 0.08; // Image scales slightly
            const overlayOpacity = progress * 0.45; // Darken on exit

            return (
              <div
                key={slide.id}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                  zIndex: idx + 10,
                  // CSS position: sticky handles stacking naturally; we clip/reveal via transform
                  transform: `translateY(${idx > activeIndex ? "0%" : "0%"})`,
                  // Hide older slides beneath the active stacks
                  opacity: idx < activeIndex - 1 ? 0 : 1,
                  pointerEvents: idx === activeIndex ? "auto" : "none",
                }}
              >
                {/* Background Image Container */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    priority={idx === 0}
                    className="object-cover transition-transform duration-100 ease-out"
                    style={{
                      transform: `scale(${imgScale})`,
                    }}
                  />
                  {/* Subtle Monochrome Vignette Overlay */}
                  <div
                    className="absolute inset-0 bg-ink/30 mix-blend-multiply transition-opacity duration-100"
                    style={{ opacity: 1 + overlayOpacity }}
                  />
                  {/* Extra dark overlay on exit */}
                  <div
                    className="absolute inset-0 bg-paper transition-opacity duration-100"
                    style={{ opacity: overlayOpacity }}
                  />
                </div>

                {/* Text Overlay Frame */}
                <div
                  className="relative z-20 max-w-4xl px-8 text-center text-paper flex flex-col items-center gap-6"
                  style={{
                    transform: `translateY(${textTranslateY}px)`,
                    opacity: 1 - progress,
                  }}
                >
                  <p className="font-util text-eyebrow uppercase tracking-widest text-paper-2 bg-accent/20 px-3 py-1 backdrop-blur-xs">
                    Theme {slide.number}
                  </p>
                  <h2 className="font-display text-h1 font-semibold leading-tight max-w-3xl drop-shadow-xs">
                    {slide.title}
                  </h2>
                  <p className="font-body text-lede max-w-2xl leading-relaxed text-paper-2 drop-shadow-xs">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.link}
                    className="mt-4 px-6 py-2.5 border border-paper/40 hover:border-paper bg-paper/10 hover:bg-paper/20 backdrop-blur-xs font-util text-eyebrow uppercase tracking-wider transition-all duration-300"
                  >
                    Explore Oral Archive →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Progress Bar Indicator (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-line/20 z-30">
          <div
            className="h-full bg-accent transition-all duration-100 ease-out"
            style={{
              width: `${(scrollTop / ((slides.length - 1) * windowHeight)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// 2. HORIZONTAL TIMELINE RAIL COMPONENT
interface ObamaHorizontalTimelineProps {
  events: TimelineEvent[];
}

export function ObamaHorizontalTimeline({ events }: ObamaHorizontalTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || !trackRef.current) return;
      const rect = scrollRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalScrollable = scrollRef.current.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setScrollProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute horizontal translation of the timeline track
  const translateX = -scrollProgress * 70; // percentage shift

  return (
    <div
      ref={scrollRef}
      className="relative w-full"
      style={{ height: "300vh" }} // vertical scroll spacing
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-paper-2 flex flex-col justify-between py-12">
        {/* Header */}
        <div className="px-8 lg:px-16 flex flex-col gap-1">
          <p className="eyebrow">Interactive Milestone Track</p>
          <h2 className="font-display text-h1 font-semibold leading-tight text-ink">
            SIET AI Research Lab Timeline
          </h2>
        </div>

        {/* Main Horizontal Track */}
        <div className="relative w-full flex-1 flex items-center overflow-hidden">
          {/* Connector Line */}
          <div className="absolute left-0 right-0 h-0.5 bg-line/40 z-0" />
          {/* Active Connector Progress Line */}
          <div
            className="absolute left-0 h-0.5 bg-accent z-0 transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          />

          {/* Scrolling Container */}
          <div
            ref={trackRef}
            className="flex items-center gap-16 px-16 md:px-32 z-10 transition-transform duration-100 ease-out"
            style={{
              transform: `translateX(${translateX}vw)`,
            }}
          >
            {events.map((event, idx) => {
              // Active node highlight condition
              const nodePercent = idx / (events.length - 1);
              const isActive = scrollProgress >= nodePercent - 0.05;

              return (
                <div
                  key={idx}
                  className="w-[300px] md:w-[400px] shrink-0 flex flex-col gap-6 relative"
                >
                  {/* Timeline Node Point */}
                  <div
                    className={`absolute -top-[53px] md:-top-[69px] left-0 w-6 h-6 rounded-full border-2 bg-paper transition-all duration-500 z-20 flex items-center justify-center ${
                      isActive ? "border-accent scale-110" : "border-line"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                        isActive ? "bg-accent scale-100" : "bg-transparent scale-0"
                      }`}
                    />
                  </div>

                  {/* Year Banner */}
                  <div>
                    <span className="font-display text-h2 font-semibold text-accent">
                      {event.year}
                    </span>
                    <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                      {event.category}
                    </p>
                  </div>

                  {/* Event Details Card */}
                  <div className="border border-line bg-paper p-6 space-y-3 shadow-xs">
                    <h3 className="font-display text-body font-medium text-ink leading-tight">
                      {event.title}
                    </h3>
                    <p className="font-body text-xs text-ink-soft leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Indicators */}
        <div className="px-8 lg:px-16 flex justify-between items-center text-ink-soft font-util text-eyebrow uppercase tracking-widest">
          <span>01 / Initial Concept</span>
          <span>Scroll Down to Travel Timeline</span>
          <span>{String(Math.round(scrollProgress * 100)).padStart(2, "0")}% Tracked</span>
        </div>
      </div>
    </div>
  );
}
