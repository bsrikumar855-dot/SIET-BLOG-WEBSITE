"use client";

import { useEffect, useRef, useState } from "react";

export function F1IntroHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const containerH = el.offsetHeight;
      const vh = window.innerHeight;

      // progress: 0 when top of container at top of viewport,
      //           1 when the sticky phase ends (container scrolled fully past)
      const scrolled = -rect.top;
      const scrollRange = containerH - vh;
      const p = Math.max(0, Math.min(1, scrolled / scrollRange));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth eased values
  const eased = easeInOutCubic(progress);

  // Overall opacity: start fading at 70% progress, fully gone at 100%
  const opacity = Math.max(0, 1 - Math.max(0, (progress - 0.6) / 0.4));

  // SIET slides left, NEWS slides right (starts moving from 20% progress)
  const moveStart = 0.15;
  const moveProg = Math.max(0, (progress - moveStart) / (1 - moveStart));
  const easedMove = easeInOutCubic(moveProg);

  const sietX = -easedMove * 40; // vw
  const newsX = easedMove * 40;  // vw

  // Tagline fades out faster
  const taglineOpacity = Math.max(0, 1 - progress * 3);

  return (
    // Tall container — the extra height creates the scroll distance for the sticky phase
    <div ref={containerRef} className="f1-hero-outer">
      {/* Sticky inner — stays in viewport while parent scrolls */}
      <div className="f1-hero-sticky">

        {/* Background */}
        <div className="f1-hero-bg" style={{ opacity }} />

        {/* Glow */}
        <div className="f1-hero-glow" style={{ opacity }} />

        {/* Split wordmark */}
        <div className="f1-hero-split-wordmark" style={{ opacity }}>
          <div
            className="f1-split-part f1-split-left"
            style={{ transform: `translateX(${sietX}vw)` }}
          >
            <span className="f1-wordmark-outline">SIET</span>
          </div>
          <div
            className="f1-split-part f1-split-right"
            style={{ transform: `translateX(${newsX}vw)` }}
          >
            <span className="f1-wordmark-solid">NEWS</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          className="f1-hero-tagline"
          style={{ opacity: taglineOpacity }}
        >
          AI Research Lab · Sri Shakthi Institute of Engineering and Technology
        </div>

        {/* Scroll indicator — only visible at start */}
        <div className="f1-hero-footer" style={{ opacity: taglineOpacity }}>
          <p className="font-util text-eyebrow tracking-widest" style={{ color: "rgba(23,21,17,0.4)", fontSize: "0.65rem", letterSpacing: "0.2em" }}>
            SCROLL TO DISCOVER
          </p>
          <div className="f1-scroll-line-container">
            <span className="f1-scroll-line" />
          </div>
        </div>

      </div>
    </div>
  );
}

// Smooth easing function
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
