import * as React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Breadcrumb, EmptyState } from "@/components/shared";
import type { Domain } from "@/lib/types";

// Static fallbacks
const FALLBACK_DOMAINS: Domain[] = [
  { slug: "ai-tech-news", name: "AI Tech News", count: 24 },
  { slug: "industry", name: "Industry", count: 18 },
  { slug: "medical-tech", name: "Medical Tech", count: 15 },
  { slug: "programming", name: "Programming", count: 32 },
  { slug: "it-news", name: "IT News", count: 21 },
];

const PIN_COLORS = [
  "#8A1E1E", // Crimson Red
  "#E07A5F", // Warm Terracotta
  "#3D5A80", // Slate Blue
  "#81B29A", // Sage Green
  "#F2CC8F", // Muted Gold
];

export default async function DomainsPage() {
  let domains: Domain[] = [];

  try {
    domains = await api.domains();
  } catch (error) {
    console.warn("Failed to fetch domains list, using fallback.", error);
    domains = FALLBACK_DOMAINS;
  }

  return (
    <main className="kitchen-page">
      {/* Breadcrumb Header */}
      <header className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Domains" },
          ]}
        />
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          Academic Domains
        </h1>
        <p className="font-body text-lede text-ink-soft max-w-xl leading-relaxed">
          Browse research material, news updates, student notes, and achievements indexed across our primary laboratory divisions.
        </p>
      </header>

      {/* Topics Tile Grid */}
      <section className="pt-8">
        {domains.length > 0 ? (
          <div className="topics-flex-container">
            {domains.map((domain: Domain, index) => {
              const pinColor = PIN_COLORS[index % PIN_COLORS.length];
              return (
                <Link
                  key={domain.slug}
                  href={`/domains/${domain.slug}`}
                  className="topic-circle-card group"
                >
                  {/* Dashed outer spinner */}
                  <div className="topic-circle-outer-ring" />
                  
                  <div className="topic-circle-inner">
                    {/* Colored Pin */}
                    <div className="topic-circle-pin-wrapper">
                      <span className="topic-circle-pin-shaft" style={{ backgroundColor: pinColor }} />
                      <span className="topic-circle-pin-head" style={{ backgroundColor: pinColor }} />
                    </div>

                    {/* Text Details */}
                    <h3 className="topic-circle-title">
                      {domain.name}
                    </h3>
                    
                    <div className="topic-circle-count">
                      <span>{domain.count} posts</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState message="No academic domains indexed yet." />
        )}
      </section>
    </main>
  );
}
