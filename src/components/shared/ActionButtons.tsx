"use client";

import { Bookmark, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  count: number;
  liked?: boolean;
};

export function LikeButton({ count, liked = false }: LikeButtonProps) {
  const [active, setActive] = useState(liked);
  const [total, setTotal] = useState(count);

  return (
    <button
      aria-pressed={active}
      className={cn("icon-action", active && "icon-action-active")}
      onClick={() => {
        setActive((current) => !current);
        setTotal((current) => current + (active ? -1 : 1));
      }}
      type="button"
    >
      <Heart aria-hidden="true" size={16} strokeWidth={1.5} />
      <span>{total}</span>
    </button>
  );
}

type BookmarkButtonProps = {
  bookmarked?: boolean;
};

export function BookmarkButton({ bookmarked = false }: BookmarkButtonProps) {
  const [active, setActive] = useState(bookmarked);

  return (
    <button
      aria-pressed={active}
      className={cn("icon-action", active && "icon-action-active")}
      onClick={() => setActive((current) => !current)}
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
