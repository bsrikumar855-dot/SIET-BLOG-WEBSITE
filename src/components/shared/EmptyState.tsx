import Link from "next/link";

type EmptyStateProps = {
  actionHref?: string;
  actionLabel?: string;
  message?: string;
};

export function EmptyState({
  actionHref = "/",
  actionLabel = "Return home",
  message = "Nothing here yet.",
}: EmptyStateProps) {
  return (
    <section className="empty-state">
      <p className="eyebrow">{message}</p>
      <Link href={actionHref}>{actionLabel}</Link>
    </section>
  );
}
