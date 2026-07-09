"use client";

import Link from "next/link";
import { Achievement } from "../types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-200 glow-card"
    >
      <div className="space-y-4">
        {/* Header category and date */}
        <div className="flex items-center justify-between">
          <Badge className="text-[10px] font-semibold uppercase tracking-wider">
            {achievement.category}
          </Badge>
          <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(achievement.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Title & Desc */}
        <div className="space-y-2">
          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
            <Link href={`/magazine/${achievement.id}`}>{achievement.title}</Link>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {achievement.description}
          </p>
        </div>

        {/* Winners List */}
        <div className="flex items-start gap-1.5 text-xs text-foreground/80 pt-1">
          <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Team: </span>
            <span className="text-muted-foreground text-[11px]">
              {achievement.winners.join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* Footer details link */}
      <div className="pt-4 border-t border-border/40 mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
          <Award className="h-3.5 w-3.5" />
          <span>SIET Pride</span>
        </div>
        <Link
          href={`/magazine/${achievement.id}`}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
        >
          <span>View Story</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
