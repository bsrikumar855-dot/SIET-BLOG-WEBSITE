"use client";

import * as React from "react";
import { Search, FileText, Settings, X, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  url: string;
  icon: React.ReactNode;
}

const SEARCH_SUGGESTIONS: SearchItem[] = [
  {
    id: "1",
    title: "Introduction to Next.js 15 App Router",
    category: "Technology",
    url: "/blog/introduction-to-nextjs-15",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "2",
    title: "College Symposium 2026 Registration Guidelines",
    category: "College Events",
    url: "/blog/college-symposium-2026",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "3",
    title: "Top Placement Interview Questions for IT Students",
    category: "Careers & Placements",
    url: "/blog/placement-interview-questions",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "4",
    title: "Profile Preferences & Bio Setup",
    category: "Settings",
    url: "/dashboard/profile",
    icon: <Settings className="h-4 w-4" />,
  },
];

export function CommandSearch() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = React.useMemo(() => {
    if (!query) return SEARCH_SUGGESTIONS;
    return SEARCH_SUGGESTIONS.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (url: string) => {
    router.push(url);
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].url);
      }
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/40 hover:bg-muted/70 px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search blogs...</span>
        <kbd className="pointer-events-none select-none rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground shadow-sm">
          Ctrl K
        </kbd>
      </button>

      {/* Dialog Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/40 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl mx-4"
              onKeyDown={handleKeyDown}
            >
              {/* Input Area */}
              <div className="flex items-center border-b border-border/60 px-4 py-3">
                <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type search terms or command..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Suggestions list */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No results found matching your search.
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Suggestions
                    </p>
                    {filteredItems.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item.url)}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors text-xs",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(isSelected ? "text-primary-foreground" : "text-muted-foreground")}>
                              {item.icon}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-medium line-clamp-1">{item.title}</span>
                              <span className={cn("text-[10px]", isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                {item.category}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono opacity-80">
                              Go <CornerDownLeft className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
