import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";
import { ArrowRight, BookOpen, Layers } from "lucide-react";

/**
 * Public Landing Page.
 */
export default function HomePage() {
  return (
    <PageContainer className="flex flex-col items-center justify-center text-center py-20 space-y-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse">
        <BookOpen className="h-8 w-8" />
      </div>

      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          SIET Blog Platform
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to the high-performance, feature-architected SIET blogging ecosystem.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 transition-all duration-200"
        >
          Explore Blogs <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground hover:bg-muted transition-all duration-200"
        >
          Author Access <Layers className="h-4 w-4" />
        </Link>
      </div>
    </PageContainer>
  );
}
