"use client";

import Link from "next/link";
import { Achievement } from "../types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Users, Trophy, ExternalLink, ArrowLeft } from "lucide-react";

// Reusable components
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Gallery } from "@/components/shared/Gallery";
import { Timeline } from "@/components/shared/Timeline";
import { MentorInfo } from "./MentorInfo";
import { CertificateBadge } from "./CertificateBadge";

interface AchievementDetailProps {
  achievement: Achievement;
}

export function AchievementDetail({ achievement }: AchievementDetailProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Achievements", href: "/magazine" },
          { label: achievement.title },
        ]}
      />

      {/* Header card block */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="text-xs px-2.5 py-0.5 font-semibold uppercase tracking-wider">
            {achievement.category}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(achievement.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          {achievement.title}
        </h1>

        {/* Meta stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground border-y border-border/40 py-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {achievement.views} views
          </span>
          <span className="border-l border-border pl-4 flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
            <Trophy className="h-3.5 w-3.5" />
            <span>Sri Shakthi Pride milestone</span>
          </span>
        </div>
      </div>

      {/* Grid splits layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Main Column */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Main Description */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Event Details & Context
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {achievement.description}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This milestone reflects the academic research, sports conditioning, and technical mentorship frameworks established at Sri Shakthi Institute of Engineering and Technology (SIET). Our student builders receive active training opportunities in laboratories and on sports courts to ensure national competitive standards are achieved.
            </p>
          </div>

          {/* Winners roster */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/10 flex items-start gap-3">
            <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h5 className="font-bold text-foreground">Awardees & Team Members</h5>
              <p className="text-muted-foreground leading-relaxed">
                {achievement.winners.join(", ")}
              </p>
            </div>
          </div>

          {/* Gallery media component (Lightbox supported) */}
          {achievement.gallery && achievement.gallery.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Media Highlights Gallery
              </h4>
              <Gallery images={achievement.gallery} />
            </div>
          )}

          {/* Project Links table */}
          {achievement.projectLinks && achievement.projectLinks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Related Project Artifacts
              </h4>
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden divide-y divide-border/40 text-xs">
                {achievement.projectLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3.5">
                    <span className="font-medium text-foreground">{link.label}</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <span>Explore Repository</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Milestones progress */}
          {achievement.timeline && achievement.timeline.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Milestone Project Roadmap
              </h4>
              <Timeline events={achievement.timeline} />
            </div>
          )}

        </div>

        {/* Sidebar Column */}
        <div className="md:col-span-4 space-y-6 sticky top-24">
          
          {/* Mentors block */}
          <MentorInfo mentors={achievement.mentors} />

          {/* Certificates block */}
          <CertificateBadge certificates={achievement.certificates} />

          {/* Back action */}
          <div className="pt-2">
            <Link href="/magazine" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Listing Board</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
