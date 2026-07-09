type LoadingSkeletonProps = {
  lines?: number;
};

export function LoadingSkeleton({ lines = 4 }: LoadingSkeletonProps) {
  return (
    <div aria-label="Loading" className="loading-skeleton" role="status">
      <div />
      {Array.from({ length: lines }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}
