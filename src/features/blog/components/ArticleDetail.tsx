"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost, Comment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Heart, Bookmark, Share2, Check, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

// Import reusable components
import { ReadingProgress } from "@/components/shared/ReadingProgress";
import { TableOfContents } from "@/components/shared/TableOfContents";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { AuthorCard } from "./AuthorCard";
import { CodeBlock } from "./CodeBlock";
import { CitationBlock, Citation } from "./CitationBlock";
import { CommentsSection } from "./CommentsSection";

interface ArticleDetailProps {
  post: BlogPost;
  initialComments?: Comment[];
  citation?: Citation;
}

export function ArticleDetail({
  post,
  initialComments = [],
  citation = {
    index: 1,
    authors: "Dr. Arul Prasad, Sanjay Kumar",
    year: "2026",
    title: "Optimized Asset Bundling and Incremental Static Regeneration in Next.js 15",
    journal: "SIET Technical Review Journal",
    volume: "12",
    pages: "45-52",
    doi: "10.5281/zenodo.12345",
  },
}: ArticleDetailProps) {
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(post.likesCount);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const articleRef = React.useRef<HTMLElement>(null);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleCode = `// src/app/api/revalidate/route.ts
import { nextRevalidate } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { path, token } = await request.json();

  if (token !== process.env.REVALIDATION_TOKEN) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // Trigger cache purge
  nextRevalidate(path);
  return Response.json({ revalidated: true, now: Date.now() });
}`;

  return (
    <article ref={articleRef} className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Scroll indicator synced to the article boundaries */}
      <ReadingProgress targetRef={articleRef} />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Publications", href: "/blog" },
          { label: post.title },
        ]}
      />

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="text-xs px-2.5 py-0.5 font-semibold uppercase tracking-wider">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground">{post.readTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border/40 py-3.5">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground/80">
              {post.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {post.likesCount * 3 + 12} views {/* simulated views */}
            </span>
          </div>

          {/* User actions: Like, Bookmark, Share */}
          <div className="flex items-center gap-2">
            {/* Like Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={cn(
                "h-8 rounded-lg border px-3 flex items-center gap-1.5 text-xs font-semibold transition-colors shadow-sm",
                liked
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30"
                  : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-rose-500 text-rose-500")} />
              <span>{likesCount}</span>
            </motion.button>

            {/* Bookmark Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setBookmarked(!bookmarked)}
              className={cn(
                "h-8 w-8 rounded-lg border flex items-center justify-center transition-colors shadow-sm",
                bookmarked
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              aria-label="Bookmark article"
            >
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-primary")} />
            </motion.button>

            {/* Share link */}
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="h-8 flex items-center gap-1.5 text-xs shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main split content frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Body content */}
        <div className="lg:col-span-8 space-y-8">
          {post.coverImage && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted border border-border/40 shadow-sm">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Reading Layout with Prose */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed space-y-6">
            <h2 id="abstract" className="scroll-m-20 text-lg font-bold tracking-tight border-b border-border/40 pb-2">
              Abstract & Introduction
            </h2>
            <p className="font-medium text-foreground">
              {post.summary}
            </p>
            <p>
              In current application architectures, caching strategies and fast re-validations play critical roles in user satisfaction parameters. Sri Shakthi Institute of Engineering and Technology (SIET) research groups continue to test optimization theories.
            </p>

            <h2 id="caching" className="scroll-m-20 text-lg font-bold tracking-tight border-b border-border/40 pb-2">
              Incremental Revalidation Handler
            </h2>
            <p>
              By leveraging dynamic purge calls inside the Next.js framework, caching structures remain fresh without requiring complete project rebuilds. We implement this path purge logic using the code structure below.
            </p>

            {/* Code Block Component */}
            <CodeBlock code={sampleCode} language="typescript" />

            <h2 id="methodology" className="scroll-m-20 text-lg font-bold tracking-tight border-b border-border/40 pb-2">
              Experimental Methodology
            </h2>
            <p>
              In our experimental setup, response times were recorded during multiple concurrent re-validations. Visual benchmarks showed an exponential reduction in resource contention when edge routes were delegated to regional servers.
            </p>

            {/* Academic Citation Block Component */}
            <CitationBlock citation={citation} format="APA" />
          </div>

          {/* Author Biography Section */}
          <div className="pt-6 border-t border-border/40">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              About the Author
            </h4>
            <AuthorCard author={post.author} />
          </div>

          {/* Comments Section Component */}
          <div className="pt-6 border-t border-border/40">
            <CommentsSection postId={post.id} initialComments={initialComments} />
          </div>

          {/* Action Back Link */}
          <div className="pt-4 border-t border-border/40">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Publications Feed</span>
            </Link>
          </div>
        </div>

        {/* Right column: Table of Contents */}
        <div className="lg:col-span-4 sticky top-24 space-y-6 hidden lg:block">
          <TableOfContents contentSelector="article" className="rounded-xl border border-border/50 bg-card/40 p-5 shadow-sm" />
        </div>

      </div>
    </article>
  );
}
