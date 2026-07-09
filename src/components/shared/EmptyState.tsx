import * as React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Common Empty State placeholder. Suitable for searches, feeds, and dashboards.
 */
export function EmptyState({
  icon = <FolderOpen className="h-10 w-10 text-muted-foreground/60" />,
  title = "No results found",
  description = "We couldn't find what you were looking for. Try refining your filters or search terms.",
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/80 rounded-2xl bg-muted/10 max-w-md mx-auto my-8 space-y-4",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 mb-2">
        {icon}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-bold text-lg tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {actionText && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="mt-2 shadow-sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
