/**
 * User Roles within the SIET Community.
 */
export type UserRole = "student" | "faculty" | "admin" | "writer";

/**
 * User Profile information.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  department?: string;
  createdAt?: string;
}

/**
 * BlogPost schema definition.
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: User;
  category: string;
  tags: string[];
  readTime: string;
  likesCount: number;
  commentsCount: number;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}

/**
 * Comment schema definition.
 */
export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
}

/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  message?: string;
}

/**
 * Paginated data wrapper.
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
