import type { Achievement, Article, Domain, NewsItem, Paginated, User } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE!;

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {};
  if (!(init?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  try {
    const res = await fetch(`${BASE}${path}`, {
      credentials: "include",
      headers: { ...headers, ...init?.headers },
      ...init,
    });
    if (!res.ok) {
      const err = new Error(`${res.status} ${path}`);
      err.stack = err.message;
      throw err;
    }
    return res.json();
  } catch (err: any) {
    if (err.message && (err.message.includes("fetch failed") || err.cause?.code === "ECONNREFUSED")) {
      const cleanErr = new Error(`fetch failed: Connection refused to ${BASE}${path}`);
      cleanErr.stack = cleanErr.message;
      throw cleanErr;
    }
    if (err instanceof Error) {
      err.stack = err.message;
    }
    throw err;
  }
}

export const api = {
  login: (b: { email: string; password: string }) =>
    req("/login", { method: "POST", body: JSON.stringify(b) }),
  logout: () => req("/logout", { method: "POST" }),
  me: () => req<User>("/me"),

  home: () => req("/home"),

  news: (q = "") => req<Paginated<NewsItem>>(`/news${q}`),
  newsBySlug: (s: string) => req<NewsItem>(`/news/${s}`),
  newsLatest: () => req<NewsItem[]>("/news/latest"),
  newsTrending: () => req<NewsItem[]>("/news/trending"),
  newsByDomain: (d: string) => req<Paginated<NewsItem>>(`/news/domain/${d}`),
  newsSearch: (q: string) => req<Paginated<NewsItem>>(`/news/search?q=${encodeURIComponent(q)}`),

  articles: (q = "") => req<Paginated<Article>>(`/articles${q}`),
  articleBySlug: (s: string) => req<Article>(`/articles/${s}`),
  articlesByDomain: (d: string) => req<Paginated<Article>>(`/articles/domain/${d}`),

  magazine: (q = "") => req<Paginated<Achievement>>(`/magazine${q}`),
  magBySlug: (s: string) => req<Achievement>(`/magazine/${s}`),
  magByType: (t: string) => req<Paginated<Achievement>>(`/magazine/type/${t}`),
  magByYear: (y: number) => req<Paginated<Achievement>>(`/magazine/year/${y}`),

  domains: () => req<Domain[]>("/domains"),
  domain: (d: string) => req<Domain>(`/domains/${d}`),
  search: (q: string) => req(`/search?q=${encodeURIComponent(q)}`),

  adminDashboard: () => req<{
    counts: { news: number; articles: number; achievements: number; users: number };
    recentActivity: { id: string; action: string; timestamp: string; details: string }[];
  }>("/admin/dashboard"),

  // Admin News
  adminNews: (q = "") => req<Paginated<NewsItem>>(`/admin/news${q}`),
  adminNewsCreate: (b: any) => req<NewsItem>("/admin/news", { method: "POST", body: JSON.stringify(b) }),
  adminNewsUpdate: (id: string, b: any) => req<NewsItem>(`/admin/news/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  adminNewsDelete: (id: string) => req<{ success: boolean }>(`/admin/news/${id}`, { method: "DELETE" }),

  // Admin Articles
  adminArticles: (q = "") => req<Paginated<Article>>(`/admin/articles${q}`),
  adminArticlesCreate: (b: any) => req<Article>("/admin/articles", { method: "POST", body: JSON.stringify(b) }),
  adminArticlesUpdate: (id: string, b: any) => req<Article>(`/admin/articles/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  adminArticlesDelete: (id: string) => req<{ success: boolean }>(`/admin/articles/${id}`, { method: "DELETE" }),

  // Admin Magazine
  adminMagazine: (q = "") => req<Paginated<Achievement>>(`/admin/magazine${q}`),
  adminMagazineCreate: (b: any) => req<Achievement>("/admin/magazine", { method: "POST", body: JSON.stringify(b) }),
  adminMagazineUpdate: (id: string, b: any) => req<Achievement>(`/admin/magazine/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  adminMagazineDelete: (id: string) => req<{ success: boolean }>(`/admin/magazine/${id}`, { method: "DELETE" }),

  // Admin Media
  adminMedia: () => req<{ id: string; url: string; filename: string; uploadedAt: string }[]>("/admin/media"),
  adminMediaUpload: (fd: FormData) => req<{ id: string; url: string; filename: string; uploadedAt: string }>("/admin/media/upload", { method: "POST", body: fd }),
  adminMediaDelete: (id: string) => req<{ success: boolean }>(`/admin/media/${id}`, { method: "DELETE" }),

  // Admin Domains
  adminDomains: () => req<Domain[]>("/admin/domains"),
  adminDomainCreate: (b: any) => req<Domain>("/admin/domains", { method: "POST", body: JSON.stringify(b) }),
  adminDomainUpdate: (slug: string, b: any) => req<Domain>(`/admin/domains/${slug}`, { method: "PUT", body: JSON.stringify(b) }),
  adminDomainDelete: (slug: string) => req<{ success: boolean }>(`/admin/domains/${slug}`, { method: "DELETE" }),

  // Admin Users
  adminUsers: () => req<User[]>("/admin/users"),
  adminUserCreate: (b: any) => req<User>("/admin/users", { method: "POST", body: JSON.stringify(b) }),
  adminUserUpdate: (id: string, b: any) => req<User>(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  adminUserDelete: (id: string) => req<{ success: boolean }>(`/admin/users/${id}`, { method: "DELETE" }),
};
