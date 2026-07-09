import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  Breadcrumb,
  SectionRail,
  ContentCard,
  TagChip,
  LikeButton,
  BookmarkButton,
  ShareButton,
} from "@/components/shared";
import type { NewsItem, Domain } from "@/lib/types";

// Static fallback data for news details
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

const FALLBACK_NEWS_DETAIL: Record<string, NewsItem & { body?: string }> = {
  "open-models-campus-lab": {
    ...FALLBACK_NEWS[0],
    body: "During the past week, the SIET AI Research Lab focused its energy on testing open-source small language models. Students set up benchmarking clusters, evaluated inference speed on local student machines, and established clean workflows for running quantized versions of new releases. The discussion also covered metric reliability and human-in-the-loop validation patterns.",
  },
  "robotics-navigation-updates": {
    ...FALLBACK_NEWS[1],
    body: "Indoor autonomous navigation remains a key bottleneck for department projects. This benchmark outlines accuracy rates across corridors, classrooms, and cafeteria locations using custom filter methods on low-cost LiDAR rigs.",
  },
  "ai-symposium-schedule": {
    ...FALLBACK_NEWS[2],
    body: "The computer science department announces the schedule for the annual SIET AI Symposium. Registrations are open starting today. Events include student workshops, paper presentations, and a hackathon with industrial mentors.",
  },
  "ethics-playbook-release": {
    ...FALLBACK_NEWS[3],
    body: "This handbook outlines practical procedures for student developers. It lists model evaluation parameters, testing checkpoints, and documentation templates to ensure responsible deployment of AI tools in public and academic spaces.",
  },
};

const getFallbackDetail = (slug: string): NewsItem & { body?: string } => {
  return (
    FALLBACK_NEWS_DETAIL[slug] || {
      id: `n-fallback-${slug}`,
      slug: slug,
      title: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      aiSummary: "Automated AI Summary for this archived article from the SIET news index.",
      sourceUrl: "https://example.com",
      sourceName: "SIET News Source",
      domain: FALLBACK_DOMAINS[0],
      tags: [{ slug: "news", name: "News" }],
      publishedAt: new Date().toISOString(),
      likes: 10,
      body: "This is a fallback placeholder for the news article. The local API is currently offline and no cached content matches this specific slug.",
    }
  );
};

type Params = Promise<{
  slug: string;
}>;

export default async function NewsDetailPage(props: { params: Params }) {
  const { slug } = await props.params;

  let item: NewsItem & { body?: string };
  let related: NewsItem[] = [];

  try {
    // Fetch individual news item
    item = await api.newsBySlug(slug);
  } catch (error) {
    console.warn(`News detail API for slug '${slug}' offline. Loading fallback.`, error);
    item = getFallbackDetail(slug);
  }

  try {
    // Fetch related news from same domain
    const res = await api.newsByDomain(item.domain.slug);
    related = res.items.filter((r) => r.slug !== slug).slice(0, 4);
  } catch (error) {
    console.warn("Related news API call failed. Using filtered fallbacks.", error);
    related = FALLBACK_NEWS.filter((r) => r.domain.slug === item.domain.slug && r.slug !== slug).slice(
      0,
      4,
    );
    if (related.length === 0) {
      related = FALLBACK_NEWS.filter((r) => r.slug !== slug).slice(0, 4);
    }
  }

  const dateString = new Date(item.publishedAt).toLocaleDateString("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <main className="kitchen-page">
      {/* Breadcrumb Header */}
      <header className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "News", href: "/news" },
            { label: item.title },
          ]}
        />
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          {item.title}
        </h1>
        {/* Eyebrow utility row */}
        <div className="flex items-center gap-4 text-ink-soft font-util text-eyebrow uppercase tracking-wider py-1 border-y border-line/50">
          <span>{item.domain.name}</span>
          <span className="text-line">·</span>
          <span>{dateString}</span>
        </div>
      </header>

      {/* Hero Image */}
      {item.image && (
        <div className="relative aspect-video w-full overflow-hidden border border-line bg-paper-2">
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* AI Summary Ruled Block */}
      <div className="border border-line bg-paper-2 p-6 space-y-2">
        <p className="eyebrow text-accent">AI Summary</p>
        <p className="font-body text-lede italic text-ink leading-relaxed">
          {item.aiSummary}
        </p>
      </div>

      {/* Main Body Content */}
      {item.body && (
        <article className="font-body text-body text-ink space-y-6 max-w-2xl leading-relaxed">
          {item.body.split("\n\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </article>
      )}

      {/* External Source Link */}
      <div className="pt-2">
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="explore-link font-util text-eyebrow uppercase tracking-wider inline-flex items-center gap-1 hover:text-accent"
        >
          {item.sourceName} <span className="text-[10px] font-sans">↗</span>
        </a>
      </div>

      {/* Tags Row */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-line">
          {item.tags.map((tag) => (
            <TagChip key={tag.slug} label={tag.name} href={`/news?tag=${tag.slug}`} />
          ))}
        </div>
      )}

      {/* Social Interactions Action Bar */}
      <div className="flex items-center gap-4 py-4 border-y border-line">
        <LikeButton count={item.likes} />
        <BookmarkButton bookmarked={item.bookmarked} />
        <ShareButton title={item.title} url={`/news/${item.slug}`} />
      </div>

      {/* Related News Rail */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-line">
          <SectionRail
            eyebrow="Related updates"
            title="Recommended Reading"
            count={related.length}
            countLabel="Updates"
            exploreHref="/news"
            exploreLabel="Explore all news"
          >
            {related.map((r) => (
              <ContentCard key={r.id} variant="news" item={r} />
            ))}
          </SectionRail>
        </div>
      )}
    </main>
  );
}
