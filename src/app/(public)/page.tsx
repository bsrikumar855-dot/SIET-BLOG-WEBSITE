import * as React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { FeatureMosaic } from "@/components/signature/FeatureMosaic";
import { ContentCard, SectionRail } from "@/components/shared";
import type { Achievement, Article, Domain, NewsItem } from "@/lib/types";

const PIN_COLORS = [
  "#8A1E1E", // Crimson Red
  "#E07A5F", // Warm Terracotta
  "#3D5A80", // Slate Blue
  "#81B29A", // Sage Green
  "#F2CC8F", // Muted Gold
];

// Static fallback data to guarantee rendering even if local API is busy or un-configured
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
];

const FALLBACK_ARTICLES: Article[] = [
  {
    id: "art1",
    slug: "building-responsible-rag",
    title: "What we learned building a responsible retrieval system",
    excerpt: "A student note on source quality, citation habits, and why retrieval interfaces often create better reading.",
    body: "",
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
    body: "",
    author: {
      id: "a2",
      name: "Siddharth N.",
      role: "Graduate Researcher",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      department: "CSE",
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
    id: "ach1",
    slug: "robotics-team-regional-final",
    title: "Robotics team reaches the regional innovation final",
    description: "A multidisciplinary student team presented an assistive navigation prototype after six weeks of lab mentoring.",
    student: FALLBACK_AUTHOR,
    department: "AI and DS",
    year: 2026,
    type: "Competition",
    domain: FALLBACK_DOMAINS[1],
    gallery: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    ],
    projectLinks: [{ label: "Project page", url: "https://example.com" }],
  },
  {
    id: "ach2",
    slug: "best-paper-ai-ethics",
    title: "Undergraduate paper wins AI Ethics symposium honors",
    description: "Honoring a student investigation into model transparency and documentation methods for research prototypes.",
    student: {
      id: "a3",
      name: "Meera Jasmine",
      role: "Student Author",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      department: "CSE",
    },
    department: "Computer Science",
    year: 2025,
    type: "Award",
    domain: FALLBACK_DOMAINS[3],
    gallery: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    ],
    projectLinks: [{ label: "Paper URL", url: "https://example.com" }],
  },
];

const FALLBACK_MOSAIC_FEATURED = {
  id: "f1",
  title: "AI Research Lab welcomes the incoming 2026 research cohort",
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  name: "Dr. Arul Prasad",
  role: "Lab Director",
  href: "/about",
};

const FALLBACK_MOSAIC_TILES = [
  {
    id: "mt1",
    title: "Kaviya Raman presents RAG system findings at Coimbatore meetup",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    name: "Kaviya Raman",
    role: "Presenter",
    href: "/magazine/robotics-team-regional-final",
  },
  {
    id: "mt2",
    title: "Ethics group publishes new transparency playbook",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    name: "AI Ethics Cell",
    role: "Research Group",
    href: "/articles/building-responsible-rag",
  },
  {
    id: "mt3",
    title: "Robotics navigation tests completed in central plaza",
    name: "Siddharth N.",
    role: "Researcher",
    href: "/news/robotics-navigation-updates",
  },
  {
    id: "mt4",
    title: "Undergrad research paper accepted at international conference",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    name: "Meera Jasmine",
    role: "Student Author",
    href: "/magazine/best-paper-ai-ethics",
  },
];

const FALLBACK_EVENTS = [
  {
    id: "e1",
    publishedAt: "2026-07-09T00:00:00.000Z",
    title: "Annual SIET AI Symposium Registration Opens",
    href: "/news/ai-symposium-schedule",
  },
  {
    id: "e2",
    publishedAt: "2026-07-05T00:00:00.000Z",
    title: "Dr. Arul Prasad Keynote on RAG Systems",
    href: "/news/open-models-campus-lab",
  },
  {
    id: "e3",
    publishedAt: "2026-06-28T00:00:00.000Z",
    title: "SIET Robotics Team regional finals schedule published",
    href: "/magazine/robotics-team-regional-final",
  },
];

export default async function HomePage() {
  let homeData: any = {};
  
  try {
    homeData = await api.home();
  } catch (error) {
    // Gracefully catch and use fallback values
    console.warn("Home API offline. Displaying client-side fallback data.", error);
  }

  // Bind values with fallbacks to guarantee robust rendering
  const featured = homeData.featured || FALLBACK_MOSAIC_FEATURED;
  const tiles = homeData.mosaicTiles || FALLBACK_MOSAIC_TILES;
  const news = homeData.news || FALLBACK_NEWS;
  const newsCount = homeData.newsCount || 87;
  const articles = homeData.articles || FALLBACK_ARTICLES;
  const articlesCount = homeData.articlesCount || 142;
  const domains = homeData.domains || FALLBACK_DOMAINS;
  const achievements = homeData.achievements || FALLBACK_ACHIEVEMENTS;
  const events = homeData.events || FALLBACK_EVENTS;

  return (
    <main className="kitchen-page">
      {/* 1. Masthead */}
      <header className="flex flex-col gap-3 pt-6 reveal">
        <h1 className="font-display text-masthead font-semibold leading-[0.9] text-ink tracking-tight">
          SIET News
        </h1>
        <p className="font-util text-eyebrow text-ink-soft tracking-[0.14em] uppercase">
          AI Research Lab · Sri Shakthi Institute of Engineering and Technology
        </p>
        <p className="font-body text-lede text-ink max-w-xl mt-2 leading-relaxed">
          AI news, student writing, and the record of what we build.
        </p>
      </header>

      {/* 2. FeatureMosaic hero */}
      <FeatureMosaic featured={featured} tiles={tiles} />

      {/* 3. News SectionRail */}
      <SectionRail
        eyebrow="News Bulletin"
        title="Latest from the Lab"
        count={newsCount}
        countLabel="News"
        exploreHref="/news"
        exploreLabel="Explore all news"
      >
        {news.map((item: NewsItem) => (
          <ContentCard key={item.id} variant="news" item={item} />
        ))}
      </SectionRail>

      {/* 4. Intro paragraph + Learn more */}
      <section className="py-6 border-t border-line flex flex-col md:flex-row gap-8 items-start reveal">
        <div className="md:w-1/3">
          <p className="eyebrow">Overview</p>
          <h2 className="font-display text-h2 font-medium leading-tight mt-2 text-ink">
            Department Record
          </h2>
        </div>
        <div className="md:w-2/3 space-y-4">
          <p className="font-body text-lede leading-relaxed text-ink">
            Between 2024 and 2026, the Sri Shakthi Institute of Engineering and Technology (SIET) AI Research Lab has served as an incubator for student research, modern open-source experimentation, and multidisciplinary engineering. This archive catalogs our progress, student publications, and active news from campus.
          </p>
          <Link className="explore-link text-eyebrow font-util uppercase tracking-wider block mt-4" href="/about">
            Learn more about the lab <span>→</span>
          </Link>
        </div>
      </section>

      {/* 5. Articles SectionRail */}
      <SectionRail
        eyebrow="Student Writing"
        title="Articles & Notes"
        count={articlesCount}
        countLabel="Articles"
        exploreHref="/articles"
        exploreLabel="Explore all articles"
      >
        {articles.map((item: Article) => (
          <ContentCard key={item.id} variant="article" item={item} />
        ))}
      </SectionRail>

      {/* 6. Domains grid */}
      <section className="py-6 border-t border-line space-y-8 reveal">
        <div className="flex justify-between items-end">
          <div>
            <p className="eyebrow">Topics</p>
            <h2 className="font-display text-h2 font-medium">Domains</h2>
          </div>
          <Link className="explore-link" href="/domains">
            See more domains <span>→</span>
          </Link>
        </div>
        
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
      </section>

      {/* 7. Achievements showcase */}
      <section className="py-6 border-t border-line space-y-8 reveal">
        <div className="flex justify-between items-end">
          <div>
            <p className="eyebrow">Magazine</p>
            <h2 className="font-display text-h2 font-medium">Achievements</h2>
          </div>
          <Link className="explore-link" href="/magazine">
            Explore all achievements <span>→</span>
          </Link>
        </div>
        
        <div className="space-y-12">
          {[2026, 2025].map((year) => {
            const yearItems = achievements.filter((a: Achievement) => a.year === year);
            if (yearItems.length === 0) return null;
            return (
              <div key={year} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-6 border-t border-line/40 first:border-0 first:pt-0">
                <div className="lg:col-span-2">
                  <h3 className="font-display text-h2 text-accent font-medium">{year}</h3>
                  <p className="font-util text-eyebrow text-ink-soft">Class Archive</p>
                </div>
                <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {yearItems.map((item: Achievement) => (
                    <ContentCard key={item.id} variant="achievement" item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. News & Events */}
      <section className="py-6 border-t border-line flex flex-col lg:flex-row gap-8 reveal">
        <div className="lg:w-1/3">
          <p className="eyebrow">Calendar</p>
          <h2 className="font-display text-h2 font-medium leading-tight mt-2 text-ink">
            News & Events
          </h2>
        </div>
        <div className="lg:w-2/3 divide-y divide-line">
          {events.map((event: { id: string; publishedAt: string; title: string; href: string }) => (
            <div key={event.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-6 group">
              <span className="font-util text-eyebrow text-accent shrink-0 pt-1 w-24">
                {new Date(event.publishedAt).toLocaleDateString("en", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
              <h3 className="font-display text-h3 font-medium text-ink group-hover:text-accent transition-colors leading-tight">
                <Link href={event.href}>{event.title}</Link>
              </h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
