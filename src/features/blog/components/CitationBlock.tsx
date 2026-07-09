"use client";

import * as React from "react";
import { Link2, Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface Citation {
  index: number;
  authors: string;
  year: string;
  title: string;
  journal: string;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
}

interface CitationBlockProps {
  citation: Citation;
  format?: "APA" | "MLA";
  className?: string;
}

export function CitationBlock({ citation, format = "APA", className }: CitationBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const getFormattedText = () => {
    const { authors, year, title, journal, volume, pages, doi } = citation;
    if (format === "APA") {
      return `${authors} (${year}). ${title}. ${journal}${volume ? `, ${volume}` : ""}${pages ? `, ${pages}` : ""}.${doi ? ` https://doi.org/${doi}` : ""}`;
    } else {
      // MLA Format fallback
      return `${authors}. "${title}." ${journal}, vol. ${volume || "n/a"}, ${year}, pp. ${pages || "n/a"}.${doi ? ` doi:${doi}` : ""}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-lg border border-border/60 bg-muted/20 p-4 flex gap-3 text-xs leading-relaxed my-4 shadow-sm group relative", className)}>
      {/* Index marker badge */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
        {citation.index}
      </span>

      {/* Citation text details */}
      <div className="space-y-2 flex-1 pr-6">
        <p className="text-foreground/90 font-medium">
          {citation.authors} ({citation.year}). <span className="italic">{citation.title}</span>. <span className="font-semibold text-foreground/80">{citation.journal}</span>
          {citation.volume && `, ${citation.volume}`}
          {citation.pages && `, ${citation.pages}`}
          .
        </p>

        {/* DOI or outbound links */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground pt-1">
          {citation.doi && (
            <span className="font-mono">DOI: {citation.doi}</span>
          )}
          {citation.url && (
            <a
              href={citation.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-0.5 text-primary hover:underline"
            >
              <Link2 className="h-3 w-3" />
              <span>Full Resource</span>
            </a>
          )}
        </div>
      </div>

      {/* Copy Citation Button (Fades in on Hover) */}
      <button
        onClick={handleCopy}
        className="absolute top-3.5 right-3.5 rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
        aria-label="Copy citation to clipboard"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
