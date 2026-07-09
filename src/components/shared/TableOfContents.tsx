"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string; // CSS selector of the article body to auto-parse headings
  items?: TOCItem[]; // Manual items fallback
  className?: string;
}

/**
 * Sticky Article Table of Contents directory. Highlights active sections on scroll.
 */
export function TableOfContents({
  contentSelector = "article",
  items: manualItems,
  className,
}: TableOfContentsProps) {
  const [headings, setHeadings] = React.useState<TOCItem[]>(manualItems || []);
  const [activeId, setActiveId] = React.useState<string>("");

  // Parse headings automatically from the document if manual list is not provided
  React.useEffect(() => {
    if (manualItems) return;

    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    const parsedElements = contentElement.querySelectorAll("h2, h3");
    const headingsList: TOCItem[] = Array.from(parsedElements).map((el, index) => {
      // Ensure the element has a valid ID for anchor links
      const text = el.textContent || "";
      const id = el.id || text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") + `-${index}`;
      el.id = id;

      return {
        id,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      };
    });

    setHeadings(headingsList);
  }, [contentSelector, manualItems]);

  // Set up IntersectionObserver to detect active heading
  React.useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -60% 0px", // Trigger when heading is in the top 40% of the viewport
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [headings]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        On This Page
      </h4>
      <nav aria-label="Table of contents" className="relative">
        <ul className="space-y-2 border-l border-border/80 pl-4 py-1 text-xs">
          {headings.map((heading) => {
            const isActive = heading.id === activeId;
            return (
              <li
                key={heading.id}
                style={{ paddingLeft: heading.level === 3 ? "12px" : "0" }}
                className="transition-all duration-200"
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleScrollTo(e, heading.id)}
                  className={cn(
                    "block py-0.5 hover:text-foreground transition-colors font-medium relative -left-[17px] pl-[17px] border-l border-transparent",
                    isActive
                      ? "text-primary border-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
