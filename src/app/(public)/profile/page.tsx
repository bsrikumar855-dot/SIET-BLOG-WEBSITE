"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Breadcrumb, ContentCard, LoadingSkeleton, EmptyState, Pagination } from "@/components/shared";
import type { User, NewsItem, Article, Achievement } from "@/lib/types";

interface GroupedData {
  news: NewsItem[];
  articles: Article[];
  magazine: Achievement[];
}

const MOCK_USER: User = {
  id: "u-mock-reader",
  name: "Dr. Babus",
  email: "reader@siet.edu",
  role: "reader"
};

const MOCK_LIKES: GroupedData = {
  news: [
    {
      id: "n1",
      slug: "open-models-campus-lab",
      title: "Open models shape a new week of student experiments",
      aiSummary: "The lab tracked model releases, classroom prototypes, and a practical discussion on evaluation methods for student-built systems.",
      sourceUrl: "https://example.com",
      sourceName: "AI Research Desk",
      domain: { slug: "machine-learning", name: "Machine Learning", count: 42 },
      tags: [
        { slug: "models", name: "Models" },
        { slug: "research", name: "Research" },
      ],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
      publishedAt: "2026-07-08T10:00:00.000Z",
      trending: true,
      likes: 87,
    }
  ],
  articles: [],
  magazine: []
};

const MOCK_BOOKMARKS: GroupedData = {
  news: [],
  articles: [
    {
      id: "art1",
      slug: "building-responsible-rag",
      title: "What we learned building a responsible retrieval system",
      excerpt: "A student note on source quality, citation habits, and why retrieval interfaces often create better reading.",
      body: "<p>Retrieval-Augmented Generation (RAG) is quickly becoming the standard architecture.</p>",
      author: {
        id: "a1",
        name: "Kaviya Raman",
        role: "Student Author",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
        department: "Artificial Intelligence and Data Science",
      },
      domain: { slug: "ethics", name: "AI Ethics", count: 12 },
      tags: [
        { slug: "rag", name: "RAG" },
        { slug: "systems", name: "Systems" },
      ],
      cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
      publishedAt: "2026-07-06T10:00:00.000Z",
      readingMinutes: 6,
      likes: 142,
      bookmarked: true,
    }
  ],
  magazine: []
};

type CombinedItem =
  | { variant: "news"; item: NewsItem; date: number }
  | { variant: "article"; item: Article; date: number }
  | { variant: "achievement"; item: Achievement; date: number };

const mapNews = (item: NewsItem): CombinedItem => ({
  variant: "news",
  item,
  date: new Date(item.publishedAt).getTime()
});

const mapArticle = (item: Article): CombinedItem => ({
  variant: "article",
  item,
  date: new Date(item.publishedAt).getTime()
});

const mapAchievement = (item: Achievement): CombinedItem => ({
  variant: "achievement",
  item,
  date: new Date(`${item.year}-01-01T00:00:00.000Z`).getTime()
});

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [user, setUser] = useState<User | null>(null);
  const [likes, setLikes] = useState<GroupedData>({ news: [], articles: [], magazine: [] });
  const [bookmarks, setBookmarks] = useState<GroupedData>({ news: [], articles: [], magazine: [] });
  const [loading, setLoading] = useState(true);

  const tab = searchParams.get("tab") === "bookmarks" ? "bookmarks" : "likes";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const itemsPerPage = 6;

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const u = await api.getCurrentUser();
        if (!active) return;
        
        // If the user is not a reader, redirect to login
        if (!u || u.role !== "reader") {
          router.push("/login");
          return;
        }

        setUser(u);

        // Keep local storage flags updated
        localStorage.setItem("siet_logged_in", "true");
        localStorage.setItem("siet_user_role", u.role);

        const [likesData, bookmarksData] = await Promise.all([
          api.myLikes(),
          api.myBookmarks()
        ]);

        if (!active) return;
        setLikes(likesData);
        setBookmarks(bookmarksData);
        setLoading(false);
      } catch (err: any) {
        console.warn("Profile API offline or unauthorized. Checking offline session flags.", err);
        if (!active) return;

        // If it's a 401 Unauthorized or a network failure but no login flag is present, redirect to login
        const hasSessionFlag = typeof window !== "undefined" && localStorage.getItem("siet_logged_in") === "true";
        const sessionRole = typeof window !== "undefined" && localStorage.getItem("siet_user_role");

        if (err.message && err.message.startsWith("401")) {
          localStorage.removeItem("siet_logged_in");
          localStorage.removeItem("siet_user_role");
          router.push("/login");
          return;
        }

        // SECURITY: these localStorage flags are client-spoofable and must
        // NEVER gate real data or be treated as authoritative — they only unlock the
        // offline MOCK_LIKES/MOCK_BOOKMARKS demo fallback when the backend is unreachable.
        // Do not extend this pattern to admin checks or real user data anywhere else.
        if (!hasSessionFlag || sessionRole !== "reader") {
          router.push("/login");
          return;
        }

        // Network error/backend offline AND valid offline session is present: fall back to mock data
        setUser(MOCK_USER);
        setLikes(MOCK_LIKES);
        setBookmarks(MOCK_BOOKMARKS);
        setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="kitchen-page py-12">
        <LoadingSkeleton lines={8} />
      </main>
    );
  }

  if (!user) return null;

  // Flatten & Sort Likes
  const combinedLikes: CombinedItem[] = [
    ...likes.news.map(mapNews),
    ...likes.articles.map(mapArticle),
    ...likes.magazine.map(mapAchievement)
  ].sort((a, b) => b.date - a.date);

  // Flatten & Sort Bookmarks
  const combinedBookmarks: CombinedItem[] = [
    ...bookmarks.news.map(mapNews),
    ...bookmarks.articles.map(mapArticle),
    ...bookmarks.magazine.map(mapAchievement)
  ].sort((a, b) => b.date - a.date);

  const activeItems = tab === "bookmarks" ? combinedBookmarks : combinedLikes;
  const totalItems = activeItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedItems = activeItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalLikesCount = combinedLikes.length;
  const totalBookmarksCount = combinedBookmarks.length;

  return (
    <main className="kitchen-page">
      {/* Header */}
      <header className="space-y-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Reader Profile" }]} />
        
        {/* Eyebrow */}
        <p className="font-util text-eyebrow text-accent uppercase tracking-wider">
          Reader Profile
        </p>

        {/* Masthead Header info */}
        <div className="py-6 border-y border-line my-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
                {user.name}
              </h1>
              <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider mt-1">
                {user.email}
              </p>
            </div>
            <button
              onClick={async () => {
                await api.logout();
                localStorage.removeItem("siet_logged_in");
                localStorage.removeItem("siet_user_role");
                window.location.href = "/";
              }}
              className="font-util text-eyebrow uppercase tracking-wider text-ink border border-line px-4 py-2 hover:bg-paper-2 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs navigation */}
      <div className="flex gap-8 border-b border-line mb-8 font-util text-eyebrow uppercase tracking-wider">
        <Link
          href="?tab=likes"
          className={`pb-4 border-b-2 -mb-[1px] transition-colors ${tab === "likes" ? "border-accent text-ink" : "border-transparent text-ink-soft hover:text-ink"}`}
        >
          Likes ({totalLikesCount})
        </Link>
        <Link
          href="?tab=bookmarks"
          className={`pb-4 border-b-2 -mb-[1px] transition-colors ${tab === "bookmarks" ? "border-accent text-ink" : "border-transparent text-ink-soft hover:text-ink"}`}
        >
          Bookmarks ({totalBookmarksCount})
        </Link>
      </div>

      {/* Tab Content: Grid Layout */}
      {totalItems > 0 ? (
        <div className="space-y-12">
          <div className="card-grid">
            {paginatedItems.map(({ variant, item }) => (
              <ContentCard key={item.id} variant={variant as any} item={item as any} />
            ))}
          </div>

          {/* Client-side Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-6">
              <Pagination page={currentPage} pages={totalPages} basePath={`/profile?tab=${tab}`} />
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          actionHref="/"
          actionLabel="Explore Articles"
          message={
            tab === "bookmarks"
              ? "You haven't bookmarked anything yet."
              : "You haven't liked anything yet."
          }
        />
      )}
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="kitchen-page py-12 text-center">
          <p className="font-display text-body italic text-ink-soft">Loading profile...</p>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
