import type { ReactNode } from "react";
import { Footer, Navbar, ScrollReveal } from "@/components/shared";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <ScrollReveal />
      {children}
      <Footer />
    </>
  );
}
