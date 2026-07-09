import { notFound } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { NewsDetail } from "@/features/news/components/NewsDetail";
import { NewsItem } from "@/features/news/types";

// ==========================================
// STATIC LOOKUP DATA matching MOCK_NEWS_DATA
// ==========================================
const MOCK_NEWS_STORE: Record<string, NewsItem> = {
  "news-1": {
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
    readTime: "4 min read",
  },
  "news-2": {
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
    readTime: "5 min read",
  },
  "news-3": {
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
    readTime: "3 min read",
  },
  "news-4": {
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
    readTime: "6 min read",
  },
  "news-5": {
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
    readTime: "3 min read",
  },
  "news-6": {
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
    readTime: "2 min read",
  },
};

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const item = MOCK_NEWS_STORE[id];

  if (!item) {
    return {
      title: "Story Not Found",
    };
  }

  return {
    title: item.title,
    description: item.summary,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const item = MOCK_NEWS_STORE[id];

  if (!item) {
    notFound();
  }

  return (
    <PageContainer>
      <NewsDetail news={item} />
    </PageContainer>
  );
}
