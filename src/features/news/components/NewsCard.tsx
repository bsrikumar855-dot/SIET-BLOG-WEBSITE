"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "../types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, User, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-border transition-all duration-200 glow-card"
    >
      {/* Thumbnail */}
      <Link href={`/news/${news.id}`} className="relative block aspect-video overflow-hidden bg-muted">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/30 text-xs">
            No Thumbnail
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="text-[10px] font-semibold uppercase tracking-wider bg-background/95 hover:bg-background text-primary border-none shadow-sm">
            {news.domain}
          </Badge>
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5 justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(news.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {news.views} views
            </span>
          </div>

          {/* Title & summary */}
          <h3 className="font-bold text-sm leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            <Link href={`/news/${news.id}`}>{news.title}</Link>
          </h3>
          <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {news.summary}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/80">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[100px]">{news.author}</span>
          </div>
          <Link
            href={`/news/${news.id}`}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
