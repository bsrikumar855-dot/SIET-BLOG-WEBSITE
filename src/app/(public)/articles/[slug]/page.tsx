import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  Breadcrumb,
  SectionRail,
  ContentCard,
  TagChip,
  AuthorCard,
  LikeButton,
  BookmarkButton,
  ShareButton,
} from "@/components/shared";
import type { Article, Domain } from "@/lib/types";

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
    body: "<p>Retrieval-Augmented Generation (RAG) is quickly becoming the standard architecture for search and knowledge retrieval inside organizations. In this article, we outline our journey building a customized retrieval system for campus archives.</p><p>We focus on three key themes: indexing document chunks, parsing clean citations, and maintaining a lightweight UI that doesn't distract the researcher.</p><p>Ultimately, a robust evaluation workflow proved critical in understanding retrieval quality under different search loads.</p>",
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
    body: "<p>Running evaluations locally is essential when developing for specific edge cases. In this guide, we present our department's testing scripts, evaluation configurations, and results across multiple open-weights model variations.</p><p>We show that using customized evaluations tailored to our local database schema yields a far more reliable indicator of live application performance.</p>",
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

const getFallbackArticle = (slug: string): Article => {
  return (
    FALLBACK_ARTICLES.find((a) => a.slug === slug) || {
      id: `art-fallback-${slug}`,
      slug: slug,
      title: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      excerpt: "A summary of this research student archive article.",
      body: `<p>This is a fallback placeholder for the article body. The local API is currently offline and no cached content matches this specific slug '${slug}'.</p><p>Please start the backend services or verify that the slug is registered correctly.</p>`,
      author: FALLBACK_AUTHOR,
      domain: FALLBACK_DOMAINS[0],
      tags: [{ slug: "general", name: "General" }],
      cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
      publishedAt: new Date().toISOString(),
      readingMinutes: 5,
      likes: 12,
    }
  );
};

type Params = Promise<{
  slug: string;
}>;

export default async function ArticleDetailPage(props: { params: Params }) {
  const { slug } = await props.params;

  let item: Article;
  let related: Article[] = [];

  try {
    item = await api.articleBySlug(slug);
  } catch (error) {
    console.warn(`Article detail API for slug '${slug}' offline. Loading fallback.`, error);
    item = getFallbackArticle(slug);
  }

  try {
    const res = await api.articlesByDomain(item.domain.slug);
    related = res.items.filter((r) => r.slug !== slug).slice(0, 4);
  } catch (error) {
    console.warn("Related articles API call failed. Using filtered fallbacks.", error);
    related = FALLBACK_ARTICLES.filter((r) => r.domain.slug === item.domain.slug && r.slug !== slug).slice(
      0,
      4,
    );
    if (related.length === 0) {
      related = FALLBACK_ARTICLES.filter((r) => r.slug !== slug).slice(0, 4);
    }
  }

  const dateString = new Date(item.publishedAt).toLocaleDateString("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <main className="kitchen-page">
      {/* Breadcrumbs Header */}
      <header className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Articles", href: "/articles" },
            { label: item.title },
          ]}
        />
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          {item.title}
        </h1>

        {/* Metadata section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-line">
          {/* Author metadata */}
          <AuthorCard author={item.author} />

          {/* Reading specs */}
          <div className="flex items-center gap-4 text-ink-soft font-util text-eyebrow uppercase tracking-wider md:text-right">
            <span>{item.domain.name}</span>
            <span className="text-line">·</span>
            <span>{dateString}</span>
            <span className="text-line">·</span>
            <span className="text-accent font-medium">{item.readingMinutes} MIN READ</span>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      {item.cover && (
        <div className="relative aspect-video w-full overflow-hidden border border-line bg-paper-2">
          <Image
            src={item.cover}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale contrast-110"
          />
        </div>
      )}

      {/* Rich-Text Body Block */}
      <article
        className="font-body text-body text-ink space-y-6 max-w-2xl leading-relaxed prose prose-stone"
        dangerouslySetInnerHTML={{ __html: item.body }}
      />

      {/* Tags Row */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-line">
          {item.tags.map((tag) => (
            <TagChip key={tag.slug} label={tag.name} href={`/articles?domain=${item.domain.slug}`} />
          ))}
        </div>
      )}

      {/* Social Interactions Action Bar */}
      <div className="flex items-center gap-4 py-4 border-y border-line">
        <LikeButton count={item.likes} />
        <BookmarkButton bookmarked={item.bookmarked} />
        <ShareButton title={item.title} url={`/articles/${item.slug}`} />
      </div>

      {/* Related Articles Rail */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-line">
          <SectionRail
            eyebrow="More from this topic"
            title="Related Articles"
            count={related.length}
            countLabel="Articles"
            exploreHref="/articles"
            exploreLabel="Explore all articles"
          >
            {related.map((r) => (
              <ContentCard key={r.id} variant="article" item={r} />
            ))}
          </SectionRail>
        </div>
      )}
    </main>
  );
}
