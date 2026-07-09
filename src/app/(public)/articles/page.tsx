import * as React from "react";
import { api } from "@/lib/api";
import { ContentCard, DomainFilter, Pagination, EmptyState } from "@/components/shared";
import type { Article, Domain, Paginated } from "@/lib/types";

// Static fallbacks for articles
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

const FALLBACK_ARTICLES: Article[] = [
  {
    id: "art1",
    slug: "building-responsible-rag",
    title: "What we learned building a responsible retrieval system",
    excerpt: "A student note on source quality, citation habits, and why retrieval interfaces often create better reading.",
    body: "<p>Retrieval-Augmented Generation (RAG) is quickly becoming the standard architecture for search and knowledge retrieval inside organizations. In this article, we outline our journey building a customized retrieval system for campus archives.</p><p>We focus on three key themes: indexing document chunks, parsing clean citations, and maintaining a lightweight UI that doesn't distract the researcher.</p>",
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
    body: "<p>Running evaluations locally is essential when developing for specific edge cases. In this guide, we present our department's testing scripts, evaluation configurations, and results across multiple open-weights model variations.</p>",
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
  {
    id: "art3",
    slug: "robotics-control-systems",
    title: "Real-time operating systems in student robotics",
    excerpt: "Exploring the differences in latency and scheduling constraints when choosing between ROS and RTOS.",
    body: "<p>Real-time constraints are crucial when operating mechanical actuators. We compare scheduling algorithms, context-switching overheads, and driver support on microcontrollers used in the SIET Robotics Lab.</p>",
    author: {
      id: "a4",
      name: "Abhishek Raj",
      role: "Student Author",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      department: "Mechatronics",
    },
    domain: FALLBACK_DOMAINS[1],
    tags: [{ slug: "robotics", name: "Robotics" }],
    cover: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    publishedAt: "2026-07-01T15:00:00.000Z",
    readingMinutes: 12,
    likes: 31,
  },
];

type SearchParams = Promise<{
  domain?: string;
  page?: string;
}>;

export default async function ArticlesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const activeDomain = searchParams.domain || "";
  const pageNum = parseInt(searchParams.page || "1", 10);

  let domains: Domain[] = [];
  let articles: Article[] = [];
  let currentPage = pageNum;
  let totalPages = 1;

  try {
    domains = await api.domains();
  } catch (error) {
    console.warn("Failed to fetch domains, using fallback.", error);
    domains = FALLBACK_DOMAINS;
  }

  try {
    if (activeDomain) {
      const res = await api.articlesByDomain(activeDomain);
      articles = res.items;
      currentPage = res.page;
      totalPages = res.pages;
    } else {
      const q = `?page=${pageNum}`;
      const res = await api.articles(q);
      articles = res.items;
      currentPage = res.page;
      totalPages = res.pages;
    }
  } catch (error) {
    console.warn("Articles API call failed. Falling back to static mock data.", error);
    let filtered = [...FALLBACK_ARTICLES];
    if (activeDomain) {
      filtered = filtered.filter(item => item.domain.slug === activeDomain);
    }
    articles = filtered;
    currentPage = 1;
    totalPages = 1;
  }

  const getDomainFilterHref = (domainSlug: string) => {
    return domainSlug ? `/articles?domain=${domainSlug}` : "/articles";
  };

  return (
    <main className="kitchen-page">
      <header className="flex flex-col gap-2 reveal">
        <p className="eyebrow">Student Writing</p>
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          Articles & Notes
        </h1>
      </header>

      {/* Domain Filter Row */}
      <div className="reveal">
        <DomainFilter
          domains={domains}
          activeSlug={activeDomain}
          hrefBuilder={getDomainFilterHref}
        />
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="card-grid">
          {articles.map((item) => (
            <ContentCard key={item.id} variant="article" item={item} />
          ))}
        </div>
      ) : (
        <EmptyState actionHref="/articles" actionLabel="View all articles" />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8 border-t border-line">
          <Pagination
            page={currentPage}
            pages={totalPages}
            basePath={activeDomain ? `/articles?domain=${activeDomain}` : "/articles"}
          />
        </div>
      )}
    </main>
  );
}
