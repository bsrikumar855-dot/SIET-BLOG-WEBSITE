"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "typescript", className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden border border-border/80 bg-zinc-950 dark:bg-black my-4 text-xs shadow-md", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/60 dark:bg-zinc-900 border-b border-zinc-800/40 text-zinc-400 font-mono text-[10px]">
        <span>{language.toLowerCase()}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors p-1 rounded hover:bg-zinc-800/60"
          aria-label="Copy code block"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container */}
      <pre className="p-4 overflow-x-auto font-mono text-zinc-100 leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}
