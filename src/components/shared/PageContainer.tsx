"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

/**
 * Common outer layout container for all routes. Enforces vertical grid spacing, maximum width
 * parameters, responsive borders, and smooth client-side Framer Motion transition animations.
 */
export function PageContainer({
  children,
  className,
  animate = true,
}: PageContainerProps) {
  if (!animate) {
    return (
      <main
        className={cn(
          "container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]",
          className
        )}
      >
        {children}
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]",
        className
      )}
    >
      {children}
    </motion.main>
  );
}
