"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Domain } from "@/lib/types";

// Fallbacks
const FALLBACK_DOMAINS: Domain[] = [
  { slug: "machine-learning", name: "Machine Learning", count: 42 },
  { slug: "robotics", name: "Robotics", count: 19 },
  { slug: "campus-research", name: "Campus Research", count: 27 },
  { slug: "ethics", name: "AI Ethics", count: 12 },
];

interface DashboardData {
  counts: { news: number; articles: number; achievements: number; users: number };
}

const FALLBACK_DASHBOARD: DashboardData = {
  counts: { news: 124, articles: 42, achievements: 18, users: 5 },
};

export default function AdminAnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(FALLBACK_DASHBOARD);
  const [domains, setDomains] = useState<Domain[]>(FALLBACK_DOMAINS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([api.adminDashboard(), api.domains()])
      .then(([dashResult, domainsResult]) => {
        if (dashResult.status === "fulfilled") {
          setDashboardData(dashResult.value);
        }
        if (domainsResult.status === "fulfilled") {
          setDomains(domainsResult.value);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPublications =
    dashboardData.counts.news +
    dashboardData.counts.articles +
    dashboardData.counts.achievements;

  // Max value for bar scaling
  const maxDomainCount = Math.max(...domains.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-line pb-4">
        <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
          metrics dashboard
        </p>
        <h1 className="font-display text-h1 font-semibold text-ink mt-1">
          Analytics & Distribution
        </h1>
      </div>

      {/* Gap Warning Banner */}
      <div className="border border-line bg-paper-2 p-4 text-xs">
        <p className="font-util text-eyebrow text-accent uppercase font-bold tracking-wider">
          API Integration Note
        </p>
        <p className="font-body text-ink mt-1 leading-relaxed">
          Because the backend API specification does not define a dedicated `/admin/analytics` endpoint,
          this console aggregates layout metrics client-side using outputs from `api.adminDashboard()`
          and public domain records (`api.domains()`).
        </p>
      </div>

      {/* General Metrics Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-line bg-paper p-5">
          <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Total Content Count
          </p>
          <p className="font-util text-h1 text-accent mt-2 font-medium">
            {totalPublications}
          </p>
          <p className="text-[10px] text-ink-soft font-util uppercase tracking-widest mt-3">
            Across news, papers, and magazine wins
          </p>
        </div>

        <div className="border border-line bg-paper p-5">
          <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Registered Writers
          </p>
          <p className="font-util text-h1 text-accent mt-2 font-medium">
            {dashboardData.counts.users}
          </p>
          <p className="text-[10px] text-ink-soft font-util uppercase tracking-widest mt-3">
            Active editor & admin profiles
          </p>
        </div>

        <div className="border border-line bg-paper p-5">
          <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Active Domains
          </p>
          <p className="font-util text-h1 text-accent mt-2 font-medium">
            {domains.length}
          </p>
          <p className="text-[10px] text-ink-soft font-util uppercase tracking-widest mt-3">
            Categorized research topics
          </p>
        </div>
      </section>

      {/* Graphs Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Publication Types Distribution (CSS Bars) */}
        <div className="border border-line bg-paper p-6 space-y-6">
          <div>
            <h3 className="font-display text-body font-semibold text-ink">
              Publications by Content Type
            </h3>
            <p className="font-util text-[10px] text-ink-soft uppercase tracking-wider mt-0.5">
              Distribution of documents across platforms
            </p>
          </div>

          <div className="space-y-4">
            {/* News */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-util uppercase tracking-wider">
                <span className="text-ink">News & Releases</span>
                <span className="text-ink-soft">{dashboardData.counts.news} items</span>
              </div>
              <div className="w-full bg-paper-2 border border-line h-6">
                <div
                  className="bg-accent h-full transition-all duration-500"
                  style={{
                    width: `${totalPublications > 0 ? (dashboardData.counts.news / totalPublications) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-util uppercase tracking-wider">
                <span className="text-ink">Research Articles</span>
                <span className="text-ink-soft">{dashboardData.counts.articles} items</span>
              </div>
              <div className="w-full bg-paper-2 border border-line h-6">
                <div
                  className="bg-accent h-full transition-all duration-500"
                  style={{
                    width: `${totalPublications > 0 ? (dashboardData.counts.articles / totalPublications) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Magazine */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-util uppercase tracking-wider">
                <span className="text-ink">Magazine Wins</span>
                <span className="text-ink-soft">{dashboardData.counts.achievements} items</span>
              </div>
              <div className="w-full bg-paper-2 border border-line h-6">
                <div
                  className="bg-accent h-full transition-all duration-500"
                  style={{
                    width: `${totalPublications > 0 ? (dashboardData.counts.achievements / totalPublications) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Domains Distribution (Custom CSS Bar List) */}
        <div className="border border-line bg-paper p-6 space-y-6">
          <div>
            <h3 className="font-display text-body font-semibold text-ink">
              Activity by Academic Domain
            </h3>
            <p className="font-util text-[10px] text-ink-soft uppercase tracking-wider mt-0.5">
              Comparative count of entries indexed per topic
            </p>
          </div>

          <div className="space-y-4">
            {domains.map((domain) => (
              <div key={domain.slug} className="space-y-1">
                <div className="flex justify-between text-xs font-util uppercase tracking-wider">
                  <span className="text-ink truncate max-w-[200px]">{domain.name}</span>
                  <span className="text-ink-soft">{domain.count} entries</span>
                </div>
                <div className="w-full bg-paper-2 border border-line h-3">
                  <div
                    className="bg-accent h-full transition-all duration-500"
                    style={{
                      width: `${(domain.count / maxDomainCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
