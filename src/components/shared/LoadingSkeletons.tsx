import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader representing a Blog Card.
 */
export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card p-0 shadow-sm">
      <Skeleton className="aspect-[16/10] w-full rounded-b-none" />
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="border-t border-border/40 pt-4 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader representing a Blog Grid feed.
 */
export function BlogFeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader representing the detailed Article View page.
 */
export function BlogDetailSkeleton() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto py-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full sm:w-4/5" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
      </div>
      <Skeleton className="aspect-[21/9] w-full rounded-xl" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader representing a Profile info block.
 */
export function ProfileSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
      <Skeleton className="h-20 w-20 rounded-full shrink-0" />
      <div className="space-y-2 w-full text-center sm:text-left">
        <Skeleton className="h-6 w-32 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-48 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
