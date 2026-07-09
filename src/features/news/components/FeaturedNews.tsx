"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedNewsProps {
  news: NewsItem;
}

export function FeaturedNews({ news }: FeaturedNewsProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-md glow-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Cover Image */}
        <div className="relative aspect-video lg:aspect-auto lg:col-span-6 bg-muted min-h-[240px]">
          {news.image ? (
            <Image
              src={news.image}
              alt={news.title}
              fill
              sizes="(max-width: 1024px) 100vw, 512px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/30">
              No Cover Image
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-background/95 hover:bg-background text-primary border-none shadow-sm">
              Featured: {news.domain}
            </Badge>
          </div>
        </div>

        {/* Contents */}
        <div className="p-6 sm:p-8 flex flex-col justify-between lg:col-span-6 space-y-6">
          <div className="space-y-4">
            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
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

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                <Link href={`/news/${news.id}`}>{news.title}</Link>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {news.summary}
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-foreground/80">{news.author}</span>
            </div>
            
            <Link href={`/news/${news.id}`}>
              <Button size="sm" className="shadow-sm">
                Read Full Story <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
