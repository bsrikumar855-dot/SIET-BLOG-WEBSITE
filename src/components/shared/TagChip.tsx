import Link from "next/link";
import { cn } from "@/lib/utils";

type TagChipProps = {
  label: string;
  href?: string;
  active?: boolean;
};

export function TagChip({ label, href, active = false }: TagChipProps) {
  const className = cn("tag-chip", active && "tag-chip-active");

  if (href) {
    return (
      <Link className={className} href={href}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}
