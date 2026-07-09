"use client";

import * as React from "react";
import { User as UserIcon, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types";
import { cn } from "@/utils/cn";
import Image from "next/image";

interface CommentsSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = React.useState<Comment[]>(initialComments);
  const [content, setContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate API post latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newComment: Comment = {
        id: `c-${Date.now()}`,
        postId,
        author: {
          id: "student-active",
          name: "Sanjay Kumar",
          email: "sanjay.it23@siet.edu.in",
          role: "student",
          department: "Information Technology",
        },
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-lg text-foreground">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder="Join the discussion... Share academic insights or ask questions."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          className="w-full min-h-[90px] rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center gap-1.5 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Comment</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No comments yet. Start the conversation!
          </p>
        ) : (
          <div className="divide-y divide-border/40">
            {comments.map((comment) => (
              <div key={comment.id} className="py-4 flex gap-4 first:pt-0">
                {/* Author Avatar */}
                <div className="relative h-9 w-9 rounded-full border border-border bg-muted overflow-hidden shrink-0">
                  {comment.author.avatarUrl ? (
                    <Image
                      src={comment.author.avatarUrl}
                      alt={comment.author.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <UserIcon className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {comment.author.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ({comment.author.role})
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono ml-auto">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
