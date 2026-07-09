import { NewsDomain } from "../types";
import { cn } from "@/utils/cn";

interface DomainFilterProps {
  activeDomain: NewsDomain | "all";
  onDomainSelect: (domain: NewsDomain | "all") => void;
  className?: string;
}

const DOMAINS: { id: NewsDomain | "all"; label: string }[] = [
  { id: "all", label: "All News" },
  { id: "academics", label: "Academics" },
  { id: "placements", label: "Placements" },
  { id: "events", label: "Events" },
  { id: "research", label: "Research" },
  { id: "sports", label: "Sports" },
  { id: "campus", label: "Campus Life" },
];

export function DomainFilter({ activeDomain, onDomainSelect, className }: DomainFilterProps) {
  return (
    <div className={cn("flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none", className)}>
      {DOMAINS.map((domain) => {
        const isSelected = activeDomain === domain.id;
        return (
          <button
            key={domain.id}
            onClick={() => onDomainSelect(domain.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              isSelected
                ? "bg-primary text-primary-foreground shadow"
                : "border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {domain.label}
          </button>
        );
      })}
    </div>
  );
}
