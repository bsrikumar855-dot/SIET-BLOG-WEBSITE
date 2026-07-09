export type NewsDomain = "academics" | "placements" | "sports" | "events" | "research" | "campus";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  date: string;
  domain: NewsDomain;
  author: string;
  views: number;
  isFeatured: boolean;
  isTrending: boolean;
  readTime?: string;
}

export interface NewsFilter {
  domain?: NewsDomain | "all";
  search?: string;
  page?: number;
  limit?: number;
}
