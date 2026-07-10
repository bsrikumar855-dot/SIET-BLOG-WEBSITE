"use client";

import { Bookmark, Heart, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

type LikeButtonProps = {
  type: "news" | "articles" | "magazine";
  slug: string;
  count: number;
  liked?: boolean;
};

export function LikeButton({ type, slug, count, liked = false }: LikeButtonProps) {
  const [active, setActive] = useState(liked);
  const [total, setTotal] = useState(count);

  useEffect(() => {
    api.getCurrentUser().then((user) => {
      if (!user || user.role !== "reader") return;

      api.likeStatus(type, slug)
        .then((status) => {
          setActive(status.liked);
          setTotal(status.count);
        })
        .catch((err) => {
          console.warn("Failed to fetch like status from API", err);
        });
    });
  }, [type, slug]);

  const handleClick = async () => {
    const user = await api.getCurrentUser();
    if (!user || user.role !== "reader") {
      window.location.href = "/login";
      return;
    }

    const nextActive = !active;
    const nextTotal = total + (nextActive ? 1 : -1);

    setActive(nextActive);
    setTotal(nextTotal);

    try {
      if (nextActive) {
        await api.like(type, slug);
      } else {
        await api.unlike(type, slug);
      }
    } catch (err) {
      console.error("Failed to persist like state, reverting", err);
      setActive(active);
      setTotal(total);
    }
  };

  return (
    <button
      aria-pressed={active}
      className={cn("icon-action", active && "icon-action-active")}
      onClick={handleClick}
      type="button"
    >
      <Heart aria-hidden="true" size={16} strokeWidth={1.5} />
      <span>{total}</span>
    </button>
  );
}

type BookmarkButtonProps = {
  type: "news" | "articles" | "magazine";
  slug: string;
  bookmarked?: boolean;
};

export function BookmarkButton({ type, slug, bookmarked = false }: BookmarkButtonProps) {
  const [active, setActive] = useState(bookmarked);

  useEffect(() => {
    api.getCurrentUser().then((user) => {
      if (!user || user.role !== "reader") return;

      api.bookmarkStatus(type, slug)
        .then((status) => {
          setActive(status.bookmarked);
        })
        .catch((err) => {
          console.warn("Failed to fetch bookmark status from API", err);
        });
    });
  }, [type, slug]);

  const handleClick = async () => {
    const user = await api.getCurrentUser();
    if (!user || user.role !== "reader") {
      window.location.href = "/login";
      return;
    }

    const nextActive = !active;
    setActive(nextActive);

    try {
      if (nextActive) {
        await api.bookmark(type, slug);
      } else {
        await api.unbookmark(type, slug);
      }
    } catch (err) {
      console.error("Failed to persist bookmark state, reverting", err);
      setActive(active);
    }
  };

  return (
    <button
      aria-pressed={active}
      className={cn("icon-action", active && "icon-action-active")}
      onClick={handleClick}
      type="button"
    >
      <Bookmark aria-hidden="true" size={16} strokeWidth={1.5} />
      <span>{active ? "Saved" : "Save"}</span>
    </button>
  );
}

type ShareButtonProps = {
  title: string;
  url?: string;
};

export function ShareButton({ title, url = "/" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareUrl = new URL(url, window.location.origin).toString();

    if (navigator.share) {
      await navigator.share({ title, url: shareUrl });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button className="icon-action" onClick={share} type="button">
      <Share2 aria-hidden="true" size={16} strokeWidth={1.5} />
      <span>{copied ? "Copied" : "Share"}</span>
    </button>
  );
}
