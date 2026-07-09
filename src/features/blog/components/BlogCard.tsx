"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types";
import { motion } from "framer-motion";
import { Calendar, Clock, Heart, MessageCircle, User } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
}

/**
 * Premium Blog Card Component. Uses Framer Motion for hover effects and clean layout structure.
 */
export function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-border transition-all duration-200 glow-card"
    >
      {/* Cover Image Container */}
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/30">
            No Cover Image
          </div>
        )}
        <div className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-primary">
          {post.category}
        </div>
      </Link>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-5 justify-between">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title & Summary */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {post.summary}
            </p>
          </div>
        </div>

        {/* Footer info: Author, Likes, Comments */}
        <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
          {/* Author */}
          <div className="flex items-center gap-2">
            {post.author.avatarUrl ? (
              <div className="relative h-6 w-6 overflow-hidden rounded-full border border-border">
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="text-xs font-medium text-foreground/90">{post.author.name}</span>
          </div>

          {/* Social Counts */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer">
              <Heart className="h-3.5 w-3.5" />
              <span className="text-xs">{post.likesCount}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="text-xs">{post.commentsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
