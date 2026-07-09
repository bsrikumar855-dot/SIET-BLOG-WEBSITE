"use client";

import Image from "next/image";
import { User, BadgeCheck, BookOpen, Heart, Award, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserType } from "@/types";
import { cn } from "@/utils/cn";

interface ProfileHeaderProps {
  user: UserType;
  stats?: {
    articles: number;
    likes: number;
    awards?: number;
  };
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  className?: string;
}

/**
 * Premium Author Profile Header block. Responsive flex grid with cover images.
 */
export function ProfileHeader({
  user,
  stats = { articles: 0, likes: 0, awards: 0 },
  isOwnProfile = false,
  onEditClick,
  className,
}: ProfileHeaderProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border/50 bg-card shadow-md", className)}>
      {/* Cover Banner Mockup */}
      <div className="relative h-32 sm:h-48 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--primary-foreground),transparent)] opacity-40" />
      </div>

      {/* Profile Details Panel */}
      <div className="relative px-6 pb-6 pt-0">
        {/* Avatar Offset */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar Frame */}
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-background bg-card overflow-hidden shadow-lg">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Profile Info Title */}
            <div className="space-y-1 pb-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {user.name}
                </h2>
                {user.role === "admin" && (
                  <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified Administrator" />
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {user.email}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-[10px] px-2 py-0">
                  {user.role.toUpperCase()}
                </Badge>
                {user.department && (
                  <span className="text-xs text-muted-foreground border-l border-border/80 pl-2">
                    {user.department}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action trigger button */}
          <div className="shrink-0 pb-1">
            {isOwnProfile ? (
              <Button onClick={onEditClick} variant="outline" size="sm" className="flex items-center gap-1.5 shadow-sm">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <Button size="sm" className="shadow-sm">
                Follow Author
              </Button>
            )}
          </div>
        </div>

        {/* Stats counter row */}
        <div className="grid grid-cols-3 gap-4 border-t border-border/40 pt-6 text-center max-w-md mx-auto sm:mx-0">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">Articles</span>
            </div>
            <p className="text-lg font-bold text-foreground leading-none">{stats.articles}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-medium">Likes</span>
            </div>
            <p className="text-lg font-bold text-foreground leading-none">{stats.likes}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium">Badges</span>
            </div>
            <p className="text-lg font-bold text-foreground leading-none">{stats.awards || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
