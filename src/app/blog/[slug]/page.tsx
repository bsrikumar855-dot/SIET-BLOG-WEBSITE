import { notFound } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { ArticleDetail } from "@/features/blog/components/ArticleDetail";
import { BlogPost, User } from "@/types";

// ==========================================
// MOCK DATA STORE matching MOCK_ARTICLES
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

const MOCK_ARTICLE_STORE: Record<string, BlogPost> = {
  "optimizing-nextjs-15-core-web-vitals": {
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
  "building-autonomous-iot-weather-system": {
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
  "navigating-placement-season-guide-juniors": {
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
  "comparative-analysis-edge-cloud-cardiac-models": {
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
  "smart-attendance-tracker-facial-recognition": {
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
};

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const post = MOCK_ARTICLE_STORE[slug];

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const post = MOCK_ARTICLE_STORE[slug];

  if (!post) {
    notFound();
  }

  // Pre-seed mock comments to keep it fully rich
  const mockComments = [
    {
      id: "c-1",
      postId: post.id,
      author: {
        id: "stud-2",
        name: "Naveen Kumar",
        email: "naveen.ece23@siet.edu.in",
        role: "student",
        department: "ECE Department",
      },
      content: "This revalidation optimization reduces latency parameters drastically on mobile devices. Excellent writeup!",
      createdAt: "2026-07-02T14:00:00Z",
    },
    {
      id: "c-2",
      postId: post.id,
      author: {
        id: "fac-2",
        name: "Dr. K. Deepa",
        email: "deepaece@siet.edu.in",
        role: "faculty",
        department: "ECE Department",
      },
      content: "Can you comment on the memory consumption of regional server revalidations compared to running edge scripts? I've seen some cache limits hit early on low tier hosting.",
      createdAt: "2026-07-02T11:30:00Z",
    },
  ];

  return (
    <PageContainer>
      <ArticleDetail post={post} initialComments={mockComments} />
    </PageContainer>
  );
}
