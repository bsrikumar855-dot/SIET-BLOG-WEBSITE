import Link from "next/link";
import { NewsItem } from "../types";
import { Eye, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TrendingNewsProps {
  items: NewsItem[];
}

/**
 * Sidebar component showing popular news items ranked in numerical order.
 */
export function TrendingNews({ items }: TrendingNewsProps) {
  if (!items || items.length === 0) return null;

  return (
    <Card className="bg-card/50 backdrop-blur-sm shadow-sm border border-border/50">
      <CardHeader className="p-5 pb-3 flex flex-row items-center gap-2 border-b border-border/40">
        <TrendingUp className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-bold tracking-tight uppercase">
          Trending Updates
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-5 space-y-4">
        {items.slice(0, 5).map((item, index) => (
          <div key={item.id} className="flex gap-4 group items-start">
            {/* Rank index */}
            <span className="text-xl font-extrabold text-muted-foreground/30 group-hover:text-primary/45 transition-colors font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
            
            {/* Link details */}
            <div className="space-y-1">
              <span className="text-[9px] font-semibold text-primary uppercase tracking-wide">
                {item.domain}
              </span>
              <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                <Link href={`/news/${item.id}`}>{item.title}</Link>
              </h4>
              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                <Eye className="h-2.5 w-2.5" />
                <span>{item.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
