import * as React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Breadcrumb, EmptyState } from "@/components/shared";
import type { Domain } from "@/lib/types";

// Static fallbacks
const FALLBACK_DOMAINS: Domain[] = [
  { slug: "machine-learning", name: "Machine Learning", count: 42 },
  { slug: "robotics", name: "Robotics", count: 19 },
  { slug: "campus-research", name: "Campus Research", count: 27 },
  { slug: "ethics", name: "AI Ethics", count: 12 },
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
      <section className="pt-4">
        {domains.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain: Domain) => (
              <Link
                key={domain.slug}
                href={`/domains/${domain.slug}`}
                className="block border border-line bg-paper-2 p-6 hover:border-ink transition-colors duration-200 outline-none focus:outline-2 focus:outline-accent"
              >
                <p className="counter text-h3 font-medium text-accent">{domain.count}</p>
                <h3 className="font-display text-h3 font-medium mt-2 leading-tight">
                  {domain.name}
                </h3>
                <p className="text-ink-soft text-xs font-util uppercase tracking-wider mt-4">
                  Explore Domain →
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="No academic domains indexed yet." />
        )}
      </section>
    </main>
  );
}
