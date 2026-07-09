import * as React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ContentCard, DomainFilter, Pagination, EmptyState } from "@/components/shared";
import type { NewsItem, Domain, Paginated } from "@/lib/types";

// Fallbacks for offline local API
const FALLBACK_DOMAINS: Domain[] = [
  { slug: "machine-learning", name: "Machine Learning", count: 42 },
  { slug: "robotics", name: "Robotics", count: 19 },
  { slug: "campus-research", name: "Campus Research", count: 27 },
  { slug: "ethics", name: "AI Ethics", count: 12 },
];

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "n1",
    slug: "open-models-campus-lab",
    title: "Open models shape a new week of student experiments",
    aiSummary: "The lab tracked model releases, classroom prototypes, and a practical discussion on evaluation methods for student-built systems.",
    sourceUrl: "https://example.com",
    sourceName: "AI Research Desk",
    domain: FALLBACK_DOMAINS[0],
    tags: [
      { slug: "models", name: "Models" },
      { slug: "research", name: "Research" },
    ],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    publishedAt: "2026-07-08T10:00:00.000Z",
    trending: true,
    likes: 87,
  },
  {
    id: "n2",
    slug: "robotics-navigation-updates",
    title: "Robotics team publishes indoor navigation benchmark",
    aiSummary: "Initial testing of LiDAR slam shows consistent map resolution under varied department lighting conditions.",
    sourceUrl: "https://example.com",
    sourceName: "Robotics Press",
    domain: FALLBACK_DOMAINS[1],
    tags: [{ slug: "navigation", name: "Navigation" }],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    publishedAt: "2026-07-07T14:30:00.000Z",
    likes: 42,
  },
  {
    id: "n3",
    slug: "ai-symposium-schedule",
    title: "SIET AI Symposium schedule and registrations open",
    aiSummary: "The annual department symposium schedules three student keynotes, a poster rail, and a mini-hackathon.",
    sourceUrl: "https://example.com",
    sourceName: "Department Bulletin",
    domain: FALLBACK_DOMAINS[2],
    tags: [{ slug: "events", name: "Events" }],
    publishedAt: "2026-07-06T09:00:00.000Z",
    likes: 19,
  },
  {
    id: "n4",
    slug: "ethics-playbook-release",
    title: "Ethics cell releases transparent AI documentation handbook",
    aiSummary: "Providing practical templates for undergraduate research projects to log model bias, data provenance, and carbon footprints.",
    sourceUrl: "https://example.com",
    sourceName: "Ethics Board",
    domain: FALLBACK_DOMAINS[3],
    tags: [{ slug: "ethics", name: "Ethics" }],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    publishedAt: "2026-07-05T16:00:00.000Z",
    likes: 56,
  },
];

type SearchParams = Promise<{
  domain?: string;
  tab?: string;
  page?: string;
}>;

export default async function NewsPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const activeDomain = searchParams.domain || "";
  const tab = searchParams.tab || "";
  const pageNum = parseInt(searchParams.page || "1", 10);

  let domains: Domain[] = [];
  let newsItems: NewsItem[] = [];
  let currentPage = pageNum;
  let totalPages = 1;
  let isPaginated = true;

  try {
    // Fetch domains for the filter
    domains = await api.domains();
  } catch (error) {
    console.warn("Failed to fetch domains, using fallback.", error);
    domains = FALLBACK_DOMAINS;
  }

  try {
    if (tab === "latest") {
      newsItems = await api.newsLatest();
      isPaginated = false;
    } else if (tab === "trending") {
      newsItems = await api.newsTrending();
      isPaginated = false;
    } else if (activeDomain) {
      const res = await api.newsByDomain(activeDomain);
      newsItems = res.items;
      currentPage = res.page;
      totalPages = res.pages;
    } else {
      const q = `?page=${pageNum}`;
      const res = await api.news(q);
      newsItems = res.items;
      currentPage = res.page;
      totalPages = res.pages;
    }
  } catch (error) {
    console.warn("News API call failed. Falling back to static mock data.", error);
    // Apply filters on fallback data locally
    let filtered = [...FALLBACK_NEWS];
    if (tab === "latest") {
      filtered = filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      isPaginated = false;
    } else if (tab === "trending") {
      filtered = filtered.filter(item => item.trending);
      isPaginated = false;
    } else if (activeDomain) {
      filtered = filtered.filter(item => item.domain.slug === activeDomain);
    }
    newsItems = filtered;
    currentPage = 1;
    totalPages = 1;
  }

  // Path builder for the DomainFilter component
  const getDomainFilterHref = (domainSlug: string) => {
    const params = new URLSearchParams();
    if (domainSlug) params.set("domain", domainSlug);
    if (tab) params.set("tab", tab);
    const queryString = params.toString();
    return `/news${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <main className="kitchen-page">
      {/* Eyebrow + Header */}
      <header className="flex flex-col gap-2 reveal">
        <p className="eyebrow">SIET Archive</p>
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          News & Updates
        </h1>
      </header>

      {/* Tabs & Domain Filter Row */}
      <div className="space-y-6 reveal">
        {/* Latest / Trending tabs */}
        <div className="flex gap-6 border-b border-line pb-3">
          <Link
            href="/news"
            className={`font-util text-eyebrow tracking-wider uppercase transition-colors ${
              !tab ? "text-accent border-b border-accent pb-3 mb-[-13px] font-medium" : "text-ink-soft hover:text-ink"
            }`}
          >
            All News
          </Link>
          <Link
            href="/news?tab=latest"
            className={`font-util text-eyebrow tracking-wider uppercase transition-colors ${
              tab === "latest" ? "text-accent border-b border-accent pb-3 mb-[-13px] font-medium" : "text-ink-soft hover:text-ink"
            }`}
          >
            Latest
          </Link>
          <Link
            href="/news?tab=trending"
            className={`font-util text-eyebrow tracking-wider uppercase transition-colors ${
              tab === "trending" ? "text-accent border-b border-accent pb-3 mb-[-13px] font-medium" : "text-ink-soft hover:text-ink"
            }`}
          >
            Trending
          </Link>
        </div>

        {/* Domain Filter (hidden when latest/trending tab is selected to focus on time/popular context) */}
        {!tab && (
          <DomainFilter
            domains={domains}
            activeSlug={activeDomain}
            hrefBuilder={getDomainFilterHref}
          />
        )}
      </div>

      {/* Main Grid View */}
      {newsItems.length > 0 ? (
        <div className="card-grid">
          {newsItems.map((item) => (
            <ContentCard key={item.id} variant="news" item={item} />
          ))}
        </div>
      ) : (
        <EmptyState actionHref="/news" actionLabel="View all news" />
      )}

      {/* Pagination (only render when query is paginated and totalPages > 1) */}
      {isPaginated && totalPages > 1 && (
        <div className="flex justify-center pt-8 border-t border-line">
          <Pagination
            page={currentPage}
            pages={totalPages}
            basePath={activeDomain ? `/news?domain=${activeDomain}` : "/news"}
          />
        </div>
      )}
    </main>
  );
}
