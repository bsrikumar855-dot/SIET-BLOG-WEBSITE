export type AchievementCategory = "sports" | "hackathon" | "academic" | "placement" | "culturals" | "all";

export interface Mentor {
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface Certificate {
  id: string;
  title: string;
  authority: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface ProjectLink {
  id: string;
  label: string;
  url: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: Exclude<AchievementCategory, "all">;
  winners: string[];
  date: string;
  mentors: Mentor[];
  certificates: Certificate[];
  projectLinks: ProjectLink[];
  gallery: GalleryItem[];
  timeline: TimelineEvent[];
  views: number;
}

export interface AchievementFilter {
  category?: AchievementCategory;
  search?: string;
  page?: number;
  limit?: number;
}
