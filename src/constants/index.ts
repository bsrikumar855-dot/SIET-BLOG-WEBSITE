/**
 * Global application metadata configuration.
 */
export const SITE_CONFIG = {
  name: "SIET Blog Platform",
  shortName: "SIET Blog",
  description: "A premium blogging and knowledge sharing platform for SIET community.",
  url: "https://siet-blog.edu",
  ogImage: "https://siet-blog.edu/og.png",
  links: {
    twitter: "https://twitter.com/siet",
    github: "https://github.com/siet",
  },
  author: "SIET Engineering",
};

/**
 * Route definition paths to prevent hardcoded URLs.
 */
export const ROUTES = {
  home: "/",
  blog: {
    list: "/blog",
    detail: (slug: string) => `/blog/${slug}`,
    create: "/blog/new",
    edit: (id: string) => `/blog/${id}/edit`,
  },
  dashboard: "/dashboard",
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
  },
  about: "/about",
  contact: "/contact",
} as const;

/**
 * Main navigation links for headers and sidebar navigation.
 */
export const NAV_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "Blogs", href: ROUTES.blog.list },
  { label: "About Us", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
] as const;

/**
 * Blog categories config.
 */
export const BLOG_CATEGORIES = [
  { id: "all", label: "All Posts" },
  { id: "tech", label: "Technology" },
  { id: "academics", label: "Academics" },
  { id: "events", label: "College Events" },
  { id: "careers", label: "Careers & Placements" },
  { id: "research", label: "Research & Innovation" },
] as const;
