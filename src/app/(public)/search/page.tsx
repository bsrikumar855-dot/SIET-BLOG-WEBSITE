"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Breadcrumb, ContentCard, EmptyState, TagChip, LoadingSkeleton } from "@/components/shared";
import type { NewsItem, Article, Achievement, Domain } from "@/lib/types";

// Static fallback data for local offline search
const FALLBACK_DOMAINS: Domain[] = [
  { slug: "machine-learning", name: "Machine Learning", count: 42 },
  { slug: "robotics", name: "Robotics", count: 19 },
  { slug: "campus-research", name: "Campus Research", count: 27 },
  { slug: "ethics", name: "AI Ethics", count: 12 },
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
    body: "<p>Retrieval-Augmented Generation (RAG) is quickly becoming the standard architecture.</p>",
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
    body: "<p>Running evaluations locally is essential.</p>",
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
    projectLinks: []
  },
];

const SUGGESTIONS = [
  "Machine Learning",
  "Robotics",
  "RAG",
  "Hackathon",
  "LiDAR",
  "Ethics",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(query);
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<Domain[]>(FALLBACK_DOMAINS);

  // Results State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Filtering State
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  // Fetch domains on mount
  useEffect(() => {
    api.domains()
      .then(setDomains)
      .catch(() => setDomains(FALLBACK_DOMAINS));
  }, []);

  // Sync state if URL param updates
  useEffect(() => {
    setInputVal(query);
  }, [query]);

  // Execute Search
  useEffect(() => {
    if (!query.trim()) {
      setNews([]);
      setArticles([]);
      setAchievements([]);
      return;
    }

    setLoading(true);

    api.search(query)
      .then((res: any) => {
        // Handle API response assuming grouped arrays: { news: [], articles: [], achievements: [] }
        setNews(res?.news || []);
        setArticles(res?.articles || []);
        setAchievements(res?.achievements || []);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Universal search API offline, resolving search client-side from fallbacks.", err);
        
        // Client-side search algorithm on fallback datasets
        const term = query.toLowerCase();

        const matchedNews = FALLBACK_NEWS.filter(
          (n) =>
            n.title.toLowerCase().includes(term) ||
            n.aiSummary.toLowerCase().includes(term) ||
            n.domain.name.toLowerCase().includes(term)
        );

        const matchedArticles = FALLBACK_ARTICLES.filter(
          (a) =>
            a.title.toLowerCase().includes(term) ||
            a.excerpt.toLowerCase().includes(term) ||
            a.author.name.toLowerCase().includes(term)
        );

        const matchedAchievements = FALLBACK_ACHIEVEMENTS.filter(
          (ac) =>
            ac.title.toLowerCase().includes(term) ||
            ac.description.toLowerCase().includes(term) ||
            ac.student.name.toLowerCase().includes(term) ||
            ac.department.toLowerCase().includes(term)
        );

        setNews(matchedNews);
        setArticles(matchedArticles);
        setAchievements(matchedAchievements);
        setLoading(false);
      });
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(inputVal)}`);
  };

  const handleSuggestionClick = (term: string) => {
    setInputVal(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // Filter items client-side
  const filterByDomain = (item: { domain: Domain }) => {
    if (selectedDomain === "all") return true;
    return item.domain.slug === selectedDomain;
  };

  const filteredNews = news.filter(filterByDomain);
  const filteredArticles = articles.filter(filterByDomain);
  const filteredAchievements = achievements.filter(filterByDomain);

  const hasNews = (selectedType === "all" || selectedType === "news") && filteredNews.length > 0;
  const hasArticles = (selectedType === "all" || selectedType === "articles") && filteredArticles.length > 0;
  const hasAchievements = (selectedType === "all" || selectedType === "achievements") && filteredAchievements.length > 0;

  const totalResults =
    (selectedType === "all" || selectedType === "news" ? filteredNews.length : 0) +
    (selectedType === "all" || selectedType === "articles" ? filteredArticles.length : 0) +
    (selectedType === "all" || selectedType === "achievements" ? filteredAchievements.length : 0);

  return (
    <main className="kitchen-page">
      {/* Header */}
      <header className="space-y-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          Search Directory
        </h1>
      </header>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <label className="sr-only" htmlFor="site-search-input">
          Search
        </label>
        <input
          id="site-search-input"
          type="search"
          placeholder="Search news, articles, or achievements..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Suggestion Chips (when query is empty) */}
      {!query.trim() && (
        <div className="space-y-3 pt-4">
          <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Suggested Search Queries
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestionClick(term)}
                className="border border-line bg-paper-2 hover:border-accent hover:text-accent transition-colors px-3 py-1 text-xs font-util uppercase tracking-wider"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Query Results / Filter Section */}
      {query.trim() && (
        <div className="space-y-8 pt-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center py-4 border-y border-line">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-util text-eyebrow text-ink-soft uppercase text-xs mr-2">
                Type:
              </span>
              {[
                { label: "All", value: "all" },
                { label: "News", value: "news" },
                { label: "Articles", value: "articles" },
                { label: "Achievements", value: "achievements" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`px-3 py-1 text-xs font-util uppercase tracking-wider border border-line transition-colors ${
                    selectedType === t.value
                      ? "bg-ink text-paper border-ink"
                      : "bg-paper hover:bg-paper-2"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-util text-eyebrow text-ink-soft uppercase text-xs mr-2">
                Domain:
              </span>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="border border-line bg-paper text-xs font-util uppercase tracking-wider px-2 py-1 outline-none focus:border-accent"
              >
                <option value="all">All Domains</option>
                {domains.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Display */}
          {loading ? (
            <div className="py-12">
              <LoadingSkeleton lines={6} />
            </div>
          ) : totalResults > 0 ? (
            <div className="space-y-12">
              {/* Grouped results count */}
              <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                We found {totalResults} result{totalResults !== 1 && "s"} for &ldquo;{query}
                &rdquo;
              </p>

              {/* Group 1: News */}
              {hasNews && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-line pb-2">
                    <h2 className="font-display text-h3 font-medium text-ink">News Updates</h2>
                    <span className="font-util text-xs bg-paper-3 px-2 py-0.5 border border-line text-ink-soft">
                      {filteredNews.length}
                    </span>
                  </div>
                  <div className="card-grid">
                    {filteredNews.map((item) => (
                      <ContentCard key={item.id} variant="news" item={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* Group 2: Articles */}
              {hasArticles && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-line pb-2">
                    <h2 className="font-display text-h3 font-medium text-ink">Research Articles</h2>
                    <span className="font-util text-xs bg-paper-3 px-2 py-0.5 border border-line text-ink-soft">
                      {filteredArticles.length}
                    </span>
                  </div>
                  <div className="card-grid">
                    {filteredArticles.map((item) => (
                      <ContentCard key={item.id} variant="article" item={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* Group 3: Achievements */}
              {hasAchievements && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-line pb-2">
                    <h2 className="font-display text-h3 font-medium text-ink">Achievements</h2>
                    <span className="font-util text-xs bg-paper-3 px-2 py-0.5 border border-line text-ink-soft">
                      {filteredAchievements.length}
                    </span>
                  </div>
                  <div className="card-grid">
                    {filteredAchievements.map((item) => (
                      <ContentCard key={item.id} variant="achievement" item={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <EmptyState
              actionHref="/search"
              actionLabel="Reset Search Query"
              message={`No entries matched query "${query}"`}
            />
          )}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="kitchen-page py-12 text-center">
          <p className="font-display text-body italic text-ink-soft">Loading search...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
