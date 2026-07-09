import * as React from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for all public-facing site pages (Home, Blogs, About, Contact).
 * Automatically appends header navigation and footer components.
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 gradient-bg">{children}</div>
      <Footer />
    </div>
  );
}
