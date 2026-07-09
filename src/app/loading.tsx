import { Loader2 } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";

export default function Loading() {
  return (
    <PageContainer className="flex flex-col items-center justify-center min-h-[75vh] space-y-4">
      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary animate-pulse">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest animate-pulse">
        Loading Sri Shakthi Portal...
      </p>
    </PageContainer>
  );
}
