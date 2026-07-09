import { BlogPost } from "@/types";

export interface BlogFilter {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
  authorId?: string;
  authorRole?: "student" | "faculty" | "all";
}

export interface CreateBlogPostInput {
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}

export interface BlogAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}
