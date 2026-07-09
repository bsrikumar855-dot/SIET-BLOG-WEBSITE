"use client";

import * as React from "react";
import { BlogPost, User } from "@/types";
import { BlogCard } from "./BlogCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { BlogCardSkeleton } from "@/components/shared/LoadingSkeletons";
import { BookOpen, Users } from "lucide-react";
import { cn } from "@/utils/cn";

// ==========================================
// MOCK ARTICLES DATA
// ==========================================
const mockFaculty: User = {
  id: "fac-1",
  name: "Dr. Arul Prasad",
  email: "arulprasad@siet.edu.in",
  role: "faculty",
  department: "Information Technology",
};

const mockFaculty2: User = {
  id: "fac-2",
  name: "Dr. K. Deepa",
  email: "deepaece@siet.edu.in",
  role: "faculty",
  department: "ECE Department",
};

const mockStudent: User = {
  id: "stud-1",
  name: "Karthik Raja",
  email: "karthik.it22@siet.edu.in",
  role: "student",
  department: "Information Technology",
};

const mockStudent2: User = {
  id: "stud-2",
  name: "Naveen Kumar",
  email: "naveen.ece23@siet.edu.in",
  role: "student",
  department: "ECE Department",
};

const MOCK_ARTICLES: BlogPost[] = [
  {
    id: "art-1",
    title: "Optimizing Next.js 15 Applications for Core Web Vitals",
    slug: "optimizing-nextjs-15-core-web-vitals",
    summary: "Deep dive into resource preloading, partial pre-rendering, and image optimization strategies inside the new App Router ecosystem.",
    content: "Full content here...",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    author: mockFaculty,
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
    content: "Full content here...",
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
  {
    id: "art-3",
    title: "Navigating placement season: A guide for engineering juniors",
    slug: "navigating-placement-season-guide-juniors",
    summary: "A breakdown of data structures, algorithm tracks, and soft skills required to clear interview stages in product-based IT companies.",
    content: "Full content here...",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    author: mockStudent,
    category: "careers",
    tags: ["Careers", "Interviews", "DS-Algo"],
    readTime: "5 min read",
    likesCount: 42,
    commentsCount: 8,
    isPublished: true,
    publishedAt: "2026-06-25T09:15:00Z",
    updatedAt: "2026-06-25T09:15:00Z",
  },
  {
    id: "art-4",
    title: "A Comparative Analysis of Edge-AI vs. Cloud-AI Cardiac Models",
    slug: "comparative-analysis-edge-cloud-cardiac-models",
    summary: "Scholarly evaluation of machine learning inference response times and classification rates in edge-based healthcare monitors.",
    content: "Full content here...",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    author: mockFaculty2,
    category: "research",
    tags: ["Machine Learning", "Edge Computing", "Healthcare"],
    readTime: "12 min read",
    likesCount: 56,
    commentsCount: 14,
    isPublished: true,
    publishedAt: "2026-06-20T11:00:00Z",
    updatedAt: "2026-06-20T11:00:00Z",
  },
  {
    id: "art-5",
    title: "Smart Attendance Tracker using Facial Recognition Systems",
    slug: "smart-attendance-tracker-facial-recognition",
    summary: "Project review on deploying OpenCV algorithms and convolutional neural networks inside college lecture halls.",
    content: "Full content here...",
    coverImage: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80",
    author: mockStudent2,
    category: "tech",
    tags: ["Computer Vision", "Python", "AI"],
    readTime: "7 min read",
    likesCount: 19,
    commentsCount: 4,
    isPublished: true,
    publishedAt: "2026-06-15T15:30:00Z",
    updatedAt: "2026-06-15T15:30:00Z",
  },
];

export function ArticleListing() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedRole, setSelectedRole] = React.useState<"all" | "student" | "faculty">("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const itemsPerPage = 3;

  // Filter Logic
  const filteredArticles = React.useMemo(() => {
    return MOCK_ARTICLES.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || art.category === selectedCategory;
      const matchesRole = selectedRole === "all" || art.author.role === selectedRole;

      return matchesSearch && matchesCategory && matchesRole;
    });
  }, [searchQuery, selectedCategory, selectedRole]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = React.useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredArticles, currentPage]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleRoleSelect = (role: "all" | "student" | "faculty") => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Publications Feed</h1>
          <p className="text-sm text-muted-foreground">
            Explore peer-reviewed research, placement notes, and campus projects published by SIET authors
          </p>
        </div>
      </div>

      {/* Filters Area */}
      <div className="space-y-4">
        <SearchBar
          onSearchChange={handleSearch}
          onCategoryChange={handleCategory}
          initialCategory={selectedCategory}
          initialSearch={searchQuery}
        />

        {/* Student vs Faculty Author Filter Toggle (Segmented Controller Style) */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/30">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-2">
            <Users className="h-3.5 w-3.5" />
            <span>Author Classification:</span>
          </span>
          
          <div className="inline-flex rounded-lg border border-border p-1 bg-card/60 backdrop-blur-sm">
            {(["all", "student", "faculty"] as const).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-all duration-200 focus-visible:outline-none",
                  selectedRole === role
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        ) : paginatedArticles.length === 0 ? (
          <EmptyState
            title="No articles found"
            description="No articles found matching your criteria. Try adjusting your keywords or category pills."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedRole("all");
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {paginatedArticles.map((post) => (
                <BlogCard key={post.id} post={post} />
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
    </div>
  );
}
