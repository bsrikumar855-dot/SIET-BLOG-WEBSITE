"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { BLOG_CATEGORIES } from "@/constants";
import { cn } from "@/utils/cn";

interface SearchBarProps {
  onSearchChange?: (val: string) => void;
  onCategoryChange?: (category: string) => void;
  initialSearch?: string;
  initialCategory?: string;
}

/**
 * Composite search and category selection bar. Fully responsive.
 */
export function SearchBar({
  onSearchChange,
  onCategoryChange,
  initialSearch = "",
  initialCategory = "all",
}: SearchBarProps) {
  const [query, setQuery] = React.useState(initialSearch);
  const [activeCategory, setActiveCategory] = React.useState(initialCategory);

  const handleClear = () => {
    setQuery("");
    onSearchChange?.("");
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearchChange?.(val);
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input Box */}
      <div role="search" className="relative flex items-center w-full rounded-xl border border-border bg-card shadow-sm focus-within:border-primary transition-all duration-200">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by keywords, tags, or authors..."
          value={query}
          onChange={handleQueryChange}
          aria-label="Search posts, tags, or authors"
          className="w-full bg-transparent py-3 pl-11 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 rounded-md p-1 hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll Container) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {BLOG_CATEGORIES.map((category) => {
          const isSelected = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isSelected
                  ? "bg-primary text-primary-foreground shadow"
                  : "border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
