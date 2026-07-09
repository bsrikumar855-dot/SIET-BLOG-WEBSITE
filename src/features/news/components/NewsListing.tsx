"use client";

import * as React from "react";
import { NewsItem, NewsDomain } from "../types";
import { NewsCard } from "./NewsCard";
import { FeaturedNews } from "./FeaturedNews";
import { TrendingNews } from "./TrendingNews";
import { DomainFilter } from "./DomainFilter";
import { SearchBar } from "@/components/shared/SearchBar";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { BlogCardSkeleton } from "@/components/shared/LoadingSkeletons";
import { Newspaper } from "lucide-react";

// ==========================================
// MOCK DATA STORAGE
// ==========================================
const MOCK_NEWS_DATA: NewsItem[] = [
  {
    id: "news-1",
    title: "SIET Secures Prestigious National Board of Accreditation (NBA) Rank",
    summary: "In a landmark assessment, Sri Shakthi B.E. programs received top tier grade ratings validation under quality benchmarks.",
    content: "Full content here...",
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
    content: "Full content here...",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    date: "2026-07-05T14:00:00Z",
    domain: "placements",
    author: "Prof. K. Vignesh (Placement Head)",
    views: 890,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "news-3",
    title: "SIET Annual Sports Gala 'Sri Shakthi Trophy 2026' Kickoff",
    summary: "Over 40 engineering colleges arrive on campus to compete in track tournaments, volleyball leagues, and athletic events.",
    content: "Full content here...",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    date: "2026-07-03T10:30:00Z",
    domain: "sports",
    author: "Mr. R. Selvam (Physical Director)",
    views: 560,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: "news-4",
    title: "Joint Research MOU Signed for Edge AI Smart-Agriculture Project",
    summary: "Sri Shakthi partners with agrarian research labs to deploy sensor monitoring systems in rural farming testing fields.",
    content: "Full content here...",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80",
    date: "2026-06-29T11:00:00Z",
    domain: "research",
    author: "Dr. S. Vignesh (ECE Dept)",
    views: 730,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "news-5",
    title: "Student Hackathon Winner Teams Honored at Assembly",
    summary: "Sri Shakthi honors student builders for securing prize money in the state innovation design challenge.",
    content: "Full content here...",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    date: "2026-06-25T09:00:00Z",
    domain: "events",
    author: "Student Affairs Council",
    views: 420,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: "news-6",
    title: "Hostel Committee Announces Renovated Recreational Zones",
    summary: "Campus life developments feature updated reading rooms, high-speed Wi-Fi, and fitness spaces for residents.",
    content: "Full content here...",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    date: "2026-06-20T16:45:00Z",
    domain: "campus",
    author: "Warden Office",
    views: 310,
    isFeatured: false,
    isTrending: false,
  },
];

export function NewsListing() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDomain, setSelectedDomain] = React.useState<NewsDomain | "all">("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorState, setErrorState] = React.useState<boolean>(false);

  const itemsPerPage = 3;

  // Filter logic
  const filteredNews = React.useMemo(() => {
    return MOCK_NEWS_DATA.filter((news) => {
      const matchesSearch =
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = selectedDomain === "all" || news.domain === selectedDomain;
      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain]);

  // Extract special views
  const featuredItem = React.useMemo(() => {
    // If we have filters active, don't show the featured banner on top
    if (searchQuery || selectedDomain !== "all") return null;
    return MOCK_NEWS_DATA.find((news) => news.isFeatured) || null;
  }, [searchQuery, selectedDomain]);

  const trendingItems = React.useMemo(() => {
    return MOCK_NEWS_DATA.filter((news) => news.isTrending);
  }, []);

  // Standard listing items (excluding featured item if rendered at top)
  const listItems = React.useMemo(() => {
    if (featuredItem && selectedDomain === "all" && !searchQuery) {
      return filteredNews.filter((item) => item.id !== featuredItem.id);
    }
    return filteredNews;
  }, [filteredNews, featuredItem, selectedDomain, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(listItems.length / itemsPerPage);
  const paginatedItems = React.useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return listItems.slice(startIdx, startIdx + itemsPerPage);
  }, [listItems, currentPage]);

  const handleDomainSelect = (domain: NewsDomain | "all") => {
    setSelectedDomain(domain);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const simulateFetchError = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setErrorState(true);
    }, 1000);
  };

  const handleRetry = () => {
    setErrorState(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  if (errorState) {
    return (
      <div className="py-12">
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header title */}
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Newspaper className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">SIET News Portal</h1>
          <p className="text-sm text-muted-foreground">Stay informed with Sri Shakthi&apos;s campus, placement, and research bulletins</p>
        </div>
      </div>

      {/* Filters HUD */}
      <div className="grid grid-cols-1 gap-4">
        <SearchBar onSearchChange={handleSearchChange} />
        <DomainFilter activeDomain={selectedDomain} onDomainSelect={handleDomainSelect} />
      </div>

      {/* Featured Banner */}
      {featuredItem && !isLoading && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Featured Headline
          </h3>
          <FeaturedNews news={featuredItem} />
        </div>
      )}

      {/* Split Grid Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
            Latest Bulletins
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
          ) : paginatedItems.length === 0 ? (
            <EmptyState
              title="No news articles found"
              description="No articles found matching your parameters. Please clear filters to browse all news."
              actionText="Reset All Filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedDomain("all");
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedItems.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <TrendingNews items={trendingItems} />
          
          {/* Debug Button to demonstrate Error State */}
          <div className="p-4 rounded-xl border border-dashed border-border/60 bg-muted/10 text-center space-y-2">
            <p className="text-[10px] text-muted-foreground">Test Boundary Handling</p>
            <button
              onClick={simulateFetchError}
              className="text-[10px] font-semibold text-primary hover:underline"
            >
              Simulate Network Error
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
