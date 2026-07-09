import type { Domain } from "@/lib/types";
import { TagChip } from "./TagChip";

type DomainFilterProps = {
  domains: Domain[];
  activeSlug?: string;
  hrefBuilder?: (slug: string) => string;
};

export function DomainFilter({ domains, activeSlug, hrefBuilder }: DomainFilterProps) {
  return (
    <nav aria-label="Filter by domain" className="domain-filter">
      <TagChip active={!activeSlug} href={hrefBuilder ? hrefBuilder("") : "/news"} label="All" />
      {domains.map((domain) => (
        <TagChip
          active={domain.slug === activeSlug}
          href={hrefBuilder ? hrefBuilder(domain.slug) : `/domains/${domain.slug}`}
          key={domain.slug}
          label={`${domain.name} ${domain.count}`}
        />
      ))}
    </nav>
  );
}

