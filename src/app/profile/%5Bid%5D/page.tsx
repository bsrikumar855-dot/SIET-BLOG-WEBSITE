import { notFound } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { ProfileHeader } from "@/components/shared/ProfileHeader";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BlogPost, User } from "@/types";

// ==========================================
// MOCK DATA STORE FOR AUTHORS AND ARTICLES
// ==========================================
const MOCK_USERS: Record<string, User> = {
  "fac-1": {
    id: "fac-1",
    name: "Dr. Arul Prasad",
    email: "arulprasad@siet.edu.in",
    role: "faculty",
    department: "Information Technology",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  "stud-1": {
    id: "stud-1",
    name: "Karthik Raja",
    email: "karthik.it22@siet.edu.in",
    role: "student",
    department: "Information Technology",
    avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
};

const MOCK_ARTICLES: BlogPost[] = [
  {
    id: "art-1",
    title: "Optimizing Next.js 15 Applications for Core Web Vitals",
    slug: "optimizing-nextjs-15-core-web-vitals",
    summary: "Deep dive into resource preloading, partial pre-rendering, and image optimization strategies inside the new App Router ecosystem.",
    content: "Full content here...",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    author: MOCK_USERS["fac-1"],
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
    author: MOCK_USERS["stud-1"],
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
    author: MOCK_USERS["stud-1"],
    category: "careers",
    tags: ["Careers", "Interviews", "DS-Algo"],
    readTime: "5 min read",
    likesCount: 42,
    commentsCount: 8,
    isPublished: true,
    publishedAt: "2026-06-25T09:15:00Z",
    updatedAt: "2026-06-25T09:15:00Z",
  },
];

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = MOCK_USERS[id];

  if (!user) {
    return {
      title: "Profile Not Found",
    };
  }

  return {
    title: `${user.name} - Author Profile`,
    description: `View publications and articles written by ${user.name} at Sri Shakthi Institute.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = MOCK_USERS[id];

  if (!user) {
    notFound();
  }

  // Filter articles by this specific author ID
  const userArticles = MOCK_ARTICLES.filter((art) => art.author.id === id);

  // Total likes accumulator
  const totalLikes = userArticles.reduce((acc, curr) => acc + curr.likesCount, 0);

  return (
    <PageContainer className="space-y-12">
      {/* Profile Banner & Details Card */}
      <ProfileHeader
        user={user}
        stats={{
          articles: userArticles.length,
          likes: totalLikes || 15,
          awards: user.role === "faculty" ? 4 : 2,
        }}
        isOwnProfile={false}
      />

      {/* Publications feed */}
      <div className="space-y-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
          Published Articles
        </h3>

        {userArticles.length === 0 ? (
          <EmptyState
            title="No published articles"
            description="This author has not published any articles to the feed yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userArticles.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
