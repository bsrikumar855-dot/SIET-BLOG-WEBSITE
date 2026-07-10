import * as React from "react";
import { api } from "@/lib/api";
import { Breadcrumb, SectionRail, ContentCard } from "@/components/shared";
import type { NewsItem, Article, Achievement, Domain } from "@/lib/types";

// Static fallbacks
const FALLBACK_DOMAINS: Domain[] = [
  { slug: "ai-tech-news", name: "AI Tech News", count: 24 },
  { slug: "industry", name: "Industry", count: 18 },
  { slug: "medical-tech", name: "Medical Tech", count: 15 },
  { slug: "programming", name: "Programming", count: 32 },
  { slug: "it-news", name: "IT News", count: 21 },
];

const FALLBACK_AUTHOR = {
  id: "a1",
  name: "Kaviya Raman",
  role: "Student Author",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  department: "Artificial Intelligence and Data Science",
};

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
];

const FALLBACK_ARTICLES: Article[] = [
  {
    id: "art1",
    slug: "building-responsible-rag",
    title: "What we learned building a responsible retrieval system",
    excerpt: "A student note on source quality, citation habits, and why retrieval interfaces often create better reading.",
    body: "<p>Retrieval-Augmented Generation (RAG) is quickly becoming the standard architecture for search and knowledge retrieval inside organizations. In this article, we outline our journey building a customized retrieval system for campus archives.</p>",
    author: FALLBACK_AUTHOR,
    domain: FALLBACK_DOMAINS[3],
    tags: [
      { slug: "rag", name: "RAG" },
      { slug: "systems", name: "Systems" },
    ],
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    publishedAt: "2026-07-06T10:00:00.000Z",
    readingMinutes: 6,
    likes: 142,
    bookmarked: true,
  },
  {
    id: "art2",
    slug: "local-evaluations-guide",
    title: "A guide to running local evaluations on student clusters",
    excerpt: "Why custom test datasets are more valuable than public leaderboards for domain-specific AI projects.",
    body: "<p>Running evaluations locally is essential when developing for specific edge cases.</p>",
    author: {
      id: "a2",
      name: "Siddharth N.",
      role: "Graduate Researcher",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      department: "Computer Science",
    },
    domain: FALLBACK_DOMAINS[0],
    tags: [{ slug: "evaluations", name: "Evaluations" }],
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    publishedAt: "2026-07-04T11:00:00.000Z",
    readingMinutes: 9,
    likes: 64,
  },
];

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ac1",
    slug: "smart-india-hackathon-2026",
    title: "First place win at national Smart India Hackathon 2026",
    description: "The AI Research Lab team won first place for their real-time edge translation system for agricultural diagnostics.",
    student: {
      id: "s1",
      name: "Sanjay Kumar",
      role: "Team Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    },
    department: "Artificial Intelligence and Data Science",
    year: 2026,
    type: "Hackathon",
    domain: FALLBACK_DOMAINS[0],
    gallery: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    ],
    projectLinks: [],
    likes: 12,
    bookmarked: false,
  },
];

const getFallbackDomain = (slug: string): Domain => {
  return (
    FALLBACK_DOMAINS.find((d) => d.slug === slug) || {
      slug,
      name: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      count: 0,
    }
  );
};

type Params = Promise<{
  domain: string;
}>;

export default async function DomainDetailPage(props: { params: Params }) {
  const { domain: domainSlug } = await props.params;

  let domain: Domain;
  let newsItems: NewsItem[] = [];
  let articles: Article[] = [];
  let achievements: Achievement[] = [];

  try {
    domain = await api.domain(domainSlug);
  } catch (error) {
    console.warn(`Failed to fetch domain details for '${domainSlug}', using fallback.`, error);
    domain = getFallbackDomain(domainSlug);
  }

  // Fetch news for domain
  try {
    const res = await api.newsByDomain(domainSlug);
    newsItems = res.items;
  } catch (error) {
    console.warn(`Failed to fetch news for domain '${domainSlug}'. Loading fallbacks.`, error);
    newsItems = FALLBACK_NEWS.filter((n) => n.domain.slug === domainSlug);
  }

  // Fetch articles for domain
  try {
    const res = await api.articlesByDomain(domainSlug);
    articles = res.items;
  } catch (error) {
    console.warn(`Failed to fetch articles for domain '${domainSlug}'. Loading fallbacks.`, error);
    articles = FALLBACK_ARTICLES.filter((a) => a.domain.slug === domainSlug);
  }

  // Fetch achievements and filter client-side (no domain endpoint exists in §6 for magazine)
  try {
    const res = await api.magazine();
    achievements = res.items.filter((a) => a.domain.slug === domainSlug);
  } catch (error) {
    console.warn(`Failed to fetch achievements for domain '${domainSlug}'. Loading fallbacks.`, error);
    achievements = FALLBACK_ACHIEVEMENTS.filter((a) => a.domain.slug === domainSlug);
  }

  const hasContent = newsItems.length > 0 || articles.length > 0 || achievements.length > 0;

  return (
    <main className="kitchen-page">
      {/* Header */}
      <header className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Domains", href: "/domains" },
            { label: domain.name },
          ]}
        />
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-line pb-4">
          <div>
            <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
              {domain.name}
            </h1>
            <p className="font-body text-lede text-ink-soft max-w-xl leading-relaxed mt-2">
              Academic review, publication archive, and student achievements from this domain.
            </p>
          </div>
          {domain.count > 0 && (
            <div className="text-right">
              <span className="font-util text-h2 font-medium text-accent">
                {domain.count}
              </span>
              <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider mt-1">
                Total entries
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main grouped sections */}
      {hasContent ? (
        <div className="space-y-12 pt-4">
          {/* News section */}
          {newsItems.length > 0 && (
            <SectionRail
              eyebrow="Updates"
              title="Recent News"
              count={newsItems.length}
              countLabel="News"
              exploreHref={`/news?domain=${domainSlug}`}
              exploreLabel="See all news"
            >
              {newsItems.map((item) => (
                <ContentCard key={item.id} variant="news" item={item} />
              ))}
            </SectionRail>
          )}

          {/* Articles section */}
          {articles.length > 0 && (
            <SectionRail
              eyebrow="Writing"
              title="Research Articles"
              count={articles.length}
              countLabel="Articles"
              exploreHref={`/articles?domain=${domainSlug}`}
              exploreLabel="See all articles"
            >
              {articles.map((item) => (
                <ContentCard key={item.id} variant="article" item={item} />
              ))}
            </SectionRail>
          )}

          {/* Achievements section */}
          {achievements.length > 0 && (
            <SectionRail
              eyebrow="Honors"
              title="Student Achievements"
              count={achievements.length}
              countLabel="Wins"
              exploreHref={`/magazine?department=&type=&year=`}
              exploreLabel="See all magazine achievements"
            >
              {achievements.map((item) => (
                <ContentCard key={item.id} variant="achievement" item={item} />
              ))}
            </SectionRail>
          )}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-line">
          <p className="font-display text-body italic text-ink-soft">
            No entries have been posted under {domain.name} yet.
          </p>
        </div>
      )}
    </main>
  );
}
