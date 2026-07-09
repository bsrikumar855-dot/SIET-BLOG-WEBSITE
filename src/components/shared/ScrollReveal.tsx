"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Select elements to reveal
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Stop observing once animated into view to conserve resources
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px", // Trigger slightly before element is fully visible
      }
    );

    elements.forEach((el) => {
      // Ensure it starts from clean slate
      el.classList.remove("revealed");
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]); // Re-initialize observer on route transitions

  return null;
}
