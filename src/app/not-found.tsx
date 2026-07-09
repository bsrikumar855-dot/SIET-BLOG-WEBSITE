"use client";

import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { EmptyState } from "@/components/shared/EmptyState";
import { HelpCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <PageContainer className="flex items-center justify-center min-h-[70vh]">
      <EmptyState
        icon={<HelpCircle className="h-10 w-10 text-destructive/80" />}
        title="404 - Page Not Found"
        description="The resource you are trying to view does not exist or has been relocated to another directory."
        actionText="Go to Homepage"
        onAction={() => router.push("/")}
      />
    </PageContainer>
  );
}
