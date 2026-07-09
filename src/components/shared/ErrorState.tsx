import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Common Error State feedback container with a retry CTA.
 */
export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this section. Please check your network or try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-destructive/20 rounded-2xl bg-destructive/5 max-w-md mx-auto my-8 space-y-4",
        className
      )}
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-bold text-lg text-foreground tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="destructive"
          size="sm"
          className="mt-2 flex items-center gap-1.5 shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retry Request</span>
        </Button>
      )}
    </div>
  );
}
