"use client";

import { useEffect } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { ErrorState } from "@/components/shared/ErrorState";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error("Global boundary caught error:", error);
  }, [error]);

  return (
    <PageContainer className="flex items-center justify-center min-h-[70vh]">
      <ErrorState
        title="Application Error"
        message="A runtime error occurred in the page controller. Please reset the layout or reload."
        onRetry={() => reset()}
      />
    </PageContainer>
  );
}
