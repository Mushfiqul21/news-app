export type PostListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: number;
  status_label: "draft" | "published";
  author: { id: number; name: string };
  created_at: string;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};