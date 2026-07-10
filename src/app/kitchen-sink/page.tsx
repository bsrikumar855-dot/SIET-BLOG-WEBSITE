import {
  AuthorCard,
  BookmarkButton,
  Breadcrumb,
  ContentCard,
  DomainFilter,
  EmptyState,
  Footer,
  LikeButton,
  LoadingSkeleton,
  Navbar,
  Pagination,
  SearchBar,
  SectionRail,
  ShareButton,
  TagChip,
} from "@/components/shared";
import type { Achievement, Article, Domain, NewsItem } from "@/lib/types";

const domains: Domain[] = [
  { slug: "machine-learning", name: "Machine Learning", count: 42 },
  { slug: "robotics", name: "Robotics", count: 19 },
  { slug: "campus-research", name: "Campus Research", count: 27 },
  { slug: "ethics", name: "AI Ethics", count: 12 },
];

const author = {
  id: "a1",
  name: "Kaviya Raman",
  role: "Student Author",
  department: "Artificial Intelligence and Data Science",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
};

const newsItem: NewsItem = {
  id: "n1",
  slug: "open-models-campus-lab",
  title: "Open models shape a new week of student experiments",
  aiSummary:
    "The lab tracked model releases, classroom prototypes, and a practical discussion on evaluation methods for student-built systems.",
  sourceUrl: "https://example.com",
  sourceName: "AI Research Desk",
  domain: domains[0],
  tags: [
    { slug: "models", name: "Models" },
    { slug: "research", name: "Research" },
  ],
  image:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  publishedAt: "2026-07-08T10:00:00.000Z",
  trending: true,
  likes: 87,
};

const articleItem: Article = {
  id: "a1",
  slug: "building-responsible-rag",
  title: "What we learned building a responsible retrieval system",
  excerpt:
    "A student note on source quality, citation habits, and why quieter interfaces often create better reading.",
  body: "",
  author,
  domain: domains[3],
  tags: [
    { slug: "rag", name: "RAG" },
    { slug: "systems", name: "Systems" },
  ],
  cover:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
  publishedAt: "2026-07-06T10:00:00.000Z",
  readingMinutes: 6,
  likes: 142,
  bookmarked: true,
};

const achievementItem: Achievement = {
  id: "m1",
  slug: "robotics-team-regional-final",
  title: "Robotics team reaches the regional innovation final",
  description:
    "A multidisciplinary student team presented an assistive navigation prototype after six weeks of lab mentoring.",
  student: author,
  department: "AI and DS",
  year: 2026,
  type: "Competition",
  domain: domains[1],
  gallery: [
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
  ],
  projectLinks: [{ label: "Project page", url: "https://example.com" }],
};

export default function KitchenSinkPage() {
  return (
    <>
      <Navbar />
      <main className="kitchen-page">
        <header className="kitchen-masthead">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Kitchen Sink" }]} />
          <p className="eyebrow">Phase 2 Shared Components</p>
          <h1>SIET News components</h1>
          <p>
            A scratch route for checking the shared editorial system in one pass:
            hairline rules, warm tokens, utility labels, and image-led color.
          </p>
        </header>

        <section className="kitchen-section" aria-labelledby="navigation-title">
          <div>
            <p className="eyebrow">Navigation and Forms</p>
            <h2 id="navigation-title">Search, filters, and pagination</h2>
          </div>
          <SearchBar />
          <DomainFilter domains={domains} activeSlug="robotics" />
          <Pagination page={2} pages={7} basePath="/news" />
          <div className="chip-row">
            <TagChip label="Machine Learning" href="/domains/machine-learning" />
            <TagChip label="Active Filter" active />
            <TagChip label="Campus" />
          </div>
        </section>

        <section className="kitchen-section" aria-labelledby="cards-title">
          <div>
            <p className="eyebrow">ContentCard variants</p>
            <h2 id="cards-title">News, articles, and magazine</h2>
          </div>
          <div className="card-grid">
            <ContentCard item={newsItem} variant="news" />
            <ContentCard item={articleItem} variant="article" />
            <ContentCard item={achievementItem} variant="achievement" />
          </div>
        </section>

        <SectionRail
          count={87}
          countLabel="News"
          exploreHref="/news"
          exploreLabel="Explore all news"
          eyebrow="SectionRail"
          title="Latest from the archive"
        >
          <ContentCard item={newsItem} variant="news" />
          <ContentCard item={articleItem} variant="article" />
          <ContentCard item={achievementItem} variant="achievement" />
          <ContentCard
            item={{ ...newsItem, id: "n2", title: "Students map new robotics lab workflows" }}
            variant="news"
          />
        </SectionRail>

        <section className="kitchen-section" aria-labelledby="people-title">
          <div>
            <p className="eyebrow">People and actions</p>
            <h2 id="people-title">Author and optimistic controls</h2>
          </div>
          <div className="kitchen-inline">
            <AuthorCard author={author} />
            <div className="action-demo">
              <LikeButton type="news" slug="kitchen-sink" count={24} />
              <BookmarkButton type="news" slug="kitchen-sink" />
              <ShareButton title="SIET News scratch route" url="/kitchen-sink" />
            </div>
          </div>
        </section>

        <section className="kitchen-section" aria-labelledby="states-title">
          <div>
            <p className="eyebrow">States</p>
            <h2 id="states-title">Loading and empty</h2>
          </div>
          <div className="state-grid">
            <LoadingSkeleton />
            <EmptyState actionHref="/news" actionLabel="Explore news" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
