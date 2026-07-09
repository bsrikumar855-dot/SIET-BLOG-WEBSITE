"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/utils/cn";

interface ReadingProgressProps {
  className?: string;
  targetRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Top horizontal reading scroll progress bar.
 */
export function ReadingProgress({ className, targetRef }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  const scaleX = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const calculateProgress = () => {
      let element = document.documentElement;
      let scrollHeight = element.scrollHeight - element.clientHeight;
      let scrollTop = element.scrollTop;

      // If tracking a specific article container instead of root body
      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const elementHeight = targetRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;

        // Calculate progress based on container relative positioning
        const scrollable = elementHeight - viewportHeight;
        if (scrollable <= 0) {
          setProgress(0);
          return;
        }
        const scrolled = Math.max(0, -rect.top);
        const percent = Math.min(1, scrolled / scrollable);
        setProgress(percent);
        return;
      }

      if (scrollHeight > 0) {
        setProgress(scrollTop / scrollHeight);
      }
    };

    window.addEventListener("scroll", calculateProgress, { passive: true });
    window.addEventListener("resize", calculateProgress);
    calculateProgress();

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [targetRef]);

  useEffect(() => {
    scaleX.set(progress);
  }, [progress, scaleX]);

  return (
    <motion.div
      className={cn("fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left shadow-sm", className)}
      style={{ scaleX }}
    />
  );
}
