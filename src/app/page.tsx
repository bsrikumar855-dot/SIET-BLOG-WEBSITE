import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, Trophy, Newspaper, Award, Calendar, ExternalLink } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { Newsletter } from "@/components/shared/Newsletter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandSearch } from "@/components/shared/CommandSearch";
import { BlogPost, User } from "@/types";

// ==========================================
// MOCK DATA FOR SERVER RENDERING (LIGHTWEIGHT)
// ==========================================

const mockAuthor: User = {
  id: "author-1",
  name: "Dr. Arul Prasad",
  email: "arulprasad@siet.edu.in",
  role: "faculty",
  department: "Information Technology",
  createdAt: "2024-01-01T00:00:00Z",
};

const mockAuthor2: User = {
  id: "author-2",
  name: "Karthik Raja",
  email: "karthik.it22@siet.edu.in",
  role: "student",
  department: "Information Technology",
  createdAt: "2024-01-01T00:00:00Z",
};

const MOCK_FEATURED_ARTICLES: BlogPost[] = [
  {
    id: "art-1",
    title: "Optimizing Next.js 15 Applications for Core Web Vitals",
    slug: "optimizing-nextjs-15-core-web-vitals",
    summary: "Deep dive into resource preloading, partial pre-rendering, and image optimization strategies inside the new App Router ecosystem.",
    content: "Full content here...",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    author: mockAuthor,
    category: "Technology",
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
    author: mockAuthor2,
    category: "Research & Innovation",
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
    author: mockAuthor2,
    category: "Careers & Placements",
    tags: ["Careers", "Interviews", "DS-Algo"],
    readTime: "5 min read",
    likesCount: 42,
    commentsCount: 8,
    isPublished: true,
    publishedAt: "2026-06-25T09:15:00Z",
    updatedAt: "2026-06-25T09:15:00Z",
  },
];

const MOCK_NEWS = [
  {
    id: "n-1",
    title: "SIET secures NBA Accreditation for all core B.E. Departments",
    date: "July 08, 2026",
    summary: "National Board of Accreditation validates SIET's teaching standard and laboratory setups with top tier certification ratings.",
    tag: "Accreditation",
  },
  {
    id: "n-2",
    title: "Annual Smart Hackathon 'Hack-SIET 2026' registration goes live",
    date: "July 05, 2026",
    summary: "Inviting student builders across South India to compete in a 36-hour sprint for sustainable technology development.",
    tag: "College Events",
  },
  {
    id: "n-3",
    title: "MOU signed with global cloud services provider for AI certifications",
    date: "June 29, 2026",
    summary: "Joint collaboration introduces specialized courses in cloud architecture and machine learning into the IT elective curriculum.",
    tag: "Academics",
  },
];

const MOCK_RESEARCH = [
  {
    id: "r-1",
    title: "An Edge-Computing Framework for Cardiac Signal Anomaly Detection",
    journal: "IEEE Journal of Biomedical Health Informatics",
    authors: "Dr. S. Vignesh, Dr. K. Deepa",
    department: "ECE & IT Department",
    link: "https://ieeexplore.ieee.org",
  },
  {
    id: "r-2",
    title: "Optimized Federated Learning for Smart Grid Power Allocation Dynamics",
    journal: "Elsevier Sustainable Energy Networks",
    authors: "Prof. R. Ananth, Karthik Raja (IT Student)",
    department: "Information Technology",
    link: "https://sciencedirect.com",
  },
];

const MOCK_ACHIEVEMENTS = [
  {
    id: "ac-1",
    title: "SIET Volleyball Team wins State Championship Trophy",
    description: "Defeated competitors in the final round to secure first place in the Inter-College State Athletics meet.",
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
  },
  {
    id: "ac-2",
    title: "Faculty honored with Best Researcher Award 2026",
    description: "Dr. Deepa of ECE department recognized for publishing 15 high-impact SCI research papers in 12 months.",
    icon: <Award className="h-5 w-5 text-amber-500" />,
  },
  {
    id: "ac-3",
    title: "Student secures Rs 12 Lakhs CTC package in Placement Drive",
    description: "Final year IT student accepted an offer from a multinational software firm as a Cloud Infrastructure Consultant.",
    icon: <GraduationCap className="h-5 w-5 text-amber-500" />,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* ==========================================
          1. HERO SECTION
          ========================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <PageContainer animate className="py-12 flex flex-col items-center justify-center text-center space-y-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Sri Shakthi Knowledge Hub</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground leading-none">
              SIET Blog & Research Platform
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore scientific publications, placement guides, academic briefs, and recent milestones published directly by the Sri Shakthi faculty and student builders.
            </p>
          </div>

          {/* Interactive Search Tool & CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
            <CommandSearch />
            <Link href="/blog">
              <Button className="shadow-lg shadow-primary/10">
                Browse Feed <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* ==========================================
          2. FEATURED NEWS SECTION
          ========================================== */}
      <section className="bg-muted/10 py-4 border-y border-border/30">
        <PageContainer animate={false} className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Campus News</h2>
            </div>
            <Link href="/blog?category=events" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              All Announcements <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_NEWS.map((item) => (
              <Card key={item.id} className="bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 flex flex-col justify-between shadow-sm">
                <CardHeader className="space-y-2 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground">{item.date}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-medium">
                      {item.tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {item.summary}
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ==========================================
          3. FEATURED RESEARCH SECTION
          ========================================== */}
      <section>
        <PageContainer animate={false} className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Scholarly Publications</h2>
            </div>
            <Link href="/blog?category=research" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View Research Hub <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_RESEARCH.map((pub) => (
              <div
                key={pub.id}
                className="group relative rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-semibold text-primary tracking-wide uppercase">
                    {pub.department}
                  </span>
                  <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                    {pub.title}
                  </h3>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p className="font-medium">Authors: <span className="text-foreground/90">{pub.authors}</span></p>
                    <p className="italic">Published in: {pub.journal}</p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-border/30 flex justify-end">
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                  >
                    <span>IEEE Xplore</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ==========================================
          4. FEATURED ARTICLES SECTION
          ========================================== */}
      <section className="bg-muted/5 py-4 border-y border-border/30">
        <PageContainer animate={false} className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Featured Publications</h2>
            </div>
            <Link href="/blog" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Explore Blog Feed <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_FEATURED_ARTICLES.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ==========================================
          5. ACHIEVEMENT OF THE WEEK
          ========================================== */}
      <section>
        <PageContainer animate={false} className="space-y-8">
          <div className="border-b border-border/40 pb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Achievement of the Week</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 sm:p-8 md:p-10 shadow-lg glow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl -z-10" />

            {/* Media / Image container */}
            <div className="relative aspect-video lg:col-span-5 rounded-xl overflow-hidden bg-muted border border-border/40 h-full min-h-[220px]">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                alt="SIET Smart India Hackathon Winners"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Text description */}
            <div className="space-y-5 lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Award className="h-3.5 w-3.5 animate-bounce" />
                <span>National Recognition</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  SIET IT Team secures 1st Place in Smart India Hackathon 2026
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Competing against 200+ teams across the country in the Ministry of Education&apos;s national challenge, our final year IT student builders designed an AI-powered logistics routing application that optimized rural cargo dispatch paths by 30%.
                </p>
              </div>

              <div className="border-t border-border/40 pt-4 flex items-center gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block">Cash Prize</span>
                  <span className="font-bold text-foreground">Rs 1,00,000</span>
                </div>
                <div className="border-l border-border/80 pl-4">
                  <span className="text-muted-foreground block">Category</span>
                  <span className="font-bold text-foreground">Smart Logistics & AI</span>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ==========================================
          6. LATEST ACHIEVEMENTS SECTION
          ========================================== */}
      <section className="bg-muted/10 py-4 border-y border-border/30">
        <PageContainer animate={false} className="space-y-8">
          <div className="border-b border-border/40 pb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Recent Campus Milestones</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_ACHIEVEMENTS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/50 bg-card p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="space-y-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-sm text-foreground leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ==========================================
          7. NEWSLETTER SECTION
          ========================================== */}
      <section>
        <PageContainer animate={false}>
          <Newsletter />
        </PageContainer>
      </section>
    </div>
  );
}
