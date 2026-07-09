"use client";

import * as React from "react";
import { Search, BookOpen, Newspaper } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { SearchBar } from "@/components/shared/SearchBar";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { NewsCard } from "@/features/news/components/NewsCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BlogPost, NewsItem, User } from "@/types";
import { cn } from "@/utils/cn";

// ==========================================
// STATIC LOOKUP DATA STORES
// ==========================================
const mockUser: User = {
  id: "fac-1",
  name: "Dr. Arul Prasad",
  email: "arulprasad@siet.edu.in",
  role: "faculty",
  department: "Information Technology",
};

const mockStudent: User = {
  id: "stud-1",
  name: "Karthik Raja",
  email: "karthik.it22@siet.edu.in",
  role: "student",
  department: "Information Technology",
};

const MOCK_ARTICLES: BlogPost[] = [
  {
    id: "art-1",
    title: "Optimizing Next.js 15 Applications for Core Web Vitals",
    slug: "optimizing-nextjs-15-core-web-vitals",
    summary: "Deep dive into resource preloading, partial pre-rendering, and image optimization strategies inside the new App Router ecosystem.",
    content: "Full content...",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    author: mockUser,
    category: "tech",
    tags: ["Next.js", "Performance", "Web Dev"],
    readTime: "6 min read",
    likesCount: 24,
    commentsCount: 5,
    isPublished: true,
    publishedAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "art-2",
    title: "Building an Autonomous IoT Weather Monitoring System",
    slug: "building-autonomous-iot-weather-system",
    summary: "How SIET IT students engineered a solar-powered weather station using ESP32 chips, MQTT brokers, and real-time dashboard visualization.",
    content: "Full content...",
    coverImage: "https://images.unsplash.com/photo-1590055531615-f16d36ffd8ec?auto=format&fit=crop&w=800&q=80",
    author: mockStudent,
    category: "research",
    tags: ["IoT", "Hardware", "Realtime"],
    readTime: "8 min read",
    likesCount: 38,
    commentsCount: 12,
    isPublished: true,
    publishedAt: "2026-06-28T14:30:00Z",
    updatedAt: "2026-06-28T14:30:00Z",
  },
];

// Helper mock news mapping for matching
interface NewsMappingItem extends NewsItem {
  image?: string;
  readTime?: string;
}

const MOCK_NEWS: NewsMappingItem[] = [
  {
    id: "news-1",
    title: "SIET Secures Prestigious National Board of Accreditation (NBA) Rank",
    summary: "In a landmark assessment, Sri Shakthi B.E. programs received top tier grade ratings validation under quality benchmarks.",
    content: "Full content...",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    date: "2026-07-08T09:00:00Z",
    domain: "academics",
    author: "Dr. S. Ramesh (Principal)",
    views: 1240,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: "news-2",
    title: "15 Students Placed in Global Tech Firm Placement Drive",
    summary: "Sri Shakthi Training and Placement department celebrates standard-setting compensation offers accepted by final year IT students.",
    content: "Full content...",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    date: "2026-07-05T14:00:00Z",
    domain: "placements",
    author: "Prof. K. Vignesh (Placement Head)",
    views: 890,
    isFeatured: false,
    isTrending: true,
  },
];

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"articles" | "news">("articles");

  // Search filter matches
  const filteredArticles = React.useMemo(() => {
    if (!query.trim()) return [];
    return MOCK_ARTICLES.filter(
      (art) =>
        art.title.toLowerCase().includes(query.toLowerCase()) ||
        art.summary.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const filteredNews = React.useMemo(() => {
    if (!query.trim()) return [];
    return MOCK_NEWS.filter(
      (news) =>
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.summary.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
  };

  const hasResults =
    (activeTab === "articles" && filteredArticles.length > 0) ||
    (activeTab === "news" && filteredNews.length > 0);

  return (
    <PageContainer className="space-y-8">
      {/* Title Header */}
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Global Search</h1>
          <p className="text-sm text-muted-foreground">
            Search across Sri Shakthi publications, campus research notes, and academic news bulletins
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <SearchBar onSearchChange={handleSearchChange} />

      {/* Results Tab Bar */}
      {query.trim() && (
        <div className="flex items-center gap-2 border-b border-border/40 pb-1">
          <button
            onClick={() => setActiveTab("articles")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 -mb-[6px] transition-colors",
              activeTab === "articles"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Publications ({filteredArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 -mb-[6px] transition-colors",
              activeTab === "news"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span>News Bulletins ({filteredNews.length})</span>
          </button>
        </div>
      )}

      {/* Results Grids */}
      <div className="space-y-6">
        {!query.trim() ? (
          <p className="text-xs text-muted-foreground text-center py-12">
            Type keywords into the search box above to begin searching.
          </p>
        ) : !hasResults ? (
          <EmptyState
            title={`No ${activeTab} found`}
            description={`We couldn't find any results matching "${query}" under ${activeTab}. Try another keyword.`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === "articles"
              ? filteredArticles.map((post) => <BlogCard key={post.id} post={post} />)
              : filteredNews.map((news) => <NewsCard key={news.id} news={news} />)}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
