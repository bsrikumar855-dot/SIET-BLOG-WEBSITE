"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, User, ArrowLeft, Share2, Check } from "lucide-react";
import { ReadingProgress } from "@/components/shared/ReadingProgress";
import { TableOfContents } from "@/components/shared/TableOfContents";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

interface NewsDetailProps {
  news: NewsItem;
}

export function NewsDetail({ news }: NewsDetailProps) {
  const [copied, setCopied] = React.useState(false);
  const articleRef = React.useRef<HTMLElement>(null);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article ref={articleRef} className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Scroll indicator synced to the article boundaries */}
      <ReadingProgress targetRef={articleRef} />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "News", href: "/news" },
          { label: news.title },
        ]}
      />

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="text-xs px-2.5 py-0.5 font-semibold uppercase tracking-wider">
            {news.domain}
          </Badge>
          {news.readTime && (
            <span className="text-xs text-muted-foreground">{news.readTime}</span>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          {news.title}
        </h1>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border/40 py-3.5">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground/80">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {news.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(news.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {news.views} views
            </span>
          </div>

          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="h-8 flex items-center gap-1.5 shadow-sm text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copied Link!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Update</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main split content frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Image & Body Text */}
        <div className="lg:col-span-8 space-y-6">
          {news.image && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted border border-border/40 shadow-sm">
              <Image
                src={news.image}
                alt={news.title}
                fill
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Render Rich News Body */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed space-y-6">
            <h2 id="summary" className="scroll-m-20 text-lg font-bold tracking-tight border-b border-border/40 pb-2">
              Executive Summary
            </h2>
            <p className="font-medium text-foreground">
              {news.summary}
            </p>

            <h2 id="details" className="scroll-m-20 text-lg font-bold tracking-tight border-b border-border/40 pb-2">
              Full Event Breakdown
            </h2>
            <p>
              Sri Shakthi Institute of Engineering and Technology (SIET) continues to reach major academic and technical milestones. The core objectives behind this initiative align directly with promoting engineering standards and developing practical, production-ready research projects inside departmental laboratories.
            </p>
            <p>
              Under current development directives, faculty investigators alongside student builders have established testing pipelines that capture key performance statistics. These results are verified by quality assurance networks to guarantee stability.
            </p>

            <h3 id="implications" className="scroll-m-20 text-base font-bold tracking-tight">
              Future Roadmap & Key Implications
            </h3>
            <p>
              Moving forward, the engineering advisory council aims to scale operations by introducing collaborative partnerships, hardware resources, and industry certs. Registrations remain active for teams wishing to participate in upcoming campus drives or hackathon seasons.
            </p>
          </div>

          {/* Action Back Button */}
          <div className="pt-6 border-t border-border/40">
            <Link href="/news" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to News Listing</span>
            </Link>
          </div>
        </div>

        {/* Right column: Sticky Table of Contents Directory */}
        <div className="lg:col-span-4 sticky top-24 space-y-6 hidden lg:block">
          <TableOfContents contentSelector="article" className="rounded-xl border border-border/50 bg-card/40 p-5 shadow-sm" />
        </div>

      </div>
    </article>
  );
}
