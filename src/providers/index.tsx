"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root Providers component. Wrap the application layout with all necessary global contexts.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="siet-blog-theme">
      {/* Add additional providers (e.g., QueryClientProvider, ToastProvider) here */}
      {children}
    </ThemeProvider>
  );
}
