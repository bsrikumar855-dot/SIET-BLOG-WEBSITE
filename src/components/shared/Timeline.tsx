"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

/**
 * Premium Vertical Timeline Component. Animate details on load using Framer Motion.
 */
export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn("relative border-l border-border/80 ml-4 md:ml-6 space-y-8 py-2", className)}>
      {events.map((event, idx) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="relative pl-6 md:pl-8 group"
        >
          {/* Timeline Dot Indicator */}
          <span className="absolute -left-[6px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-border border border-background group-hover:bg-primary group-hover:scale-125 transition-all duration-200" />

          {/* Event Content card */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-primary">{event.date}</span>
              {event.category && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0">
                  {event.category}
                </Badge>
              )}
            </div>
            <h4 className="font-bold text-base text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
              {event.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {event.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
