export type Domain = { slug: string; name: string; count: number };
export type Tag = { slug: string; name: string };
export type Author = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  department?: string;
};

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  aiSummary: string;
  sourceUrl: string;
  sourceName: string;
  domain: Domain;
  tags: Tag[];
  image?: string;
  publishedAt: string;
  trending?: boolean;
  likes: number;
  bookmarked?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: Author;
  domain: Domain;
  tags: Tag[];
  cover?: string;
  publishedAt: string;
  readingMinutes: number;
  likes: number;
  bookmarked?: boolean;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  student: Author;
  department: string;
  year: number;
  type: string;
  domain: Domain;
  gallery: string[];
  certificateUrl?: string;
  projectLinks: { label: string; url: string }[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}
