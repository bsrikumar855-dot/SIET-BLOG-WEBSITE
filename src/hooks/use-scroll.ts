"use client";

import { useEffect, useState } from "react";

/**
 * Tracks window scroll position to enable scroll-based styling,
 * such as shrinking headers or fade-in elements.
 *
 * @param threshold The scroll distance in pixels to trigger the threshold state.
 */
export function useScroll(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setYOffset(window.scrollY);
      if (window.scrollY > threshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to capture initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { scrolled, yOffset };
}
