export type PostStatus = "draft" | "public" | "unlisted";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  pinned: boolean;
  shareToken: string;
  readingMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
};

export type BlogSettings = {
  title: string;
  description: string;
  author: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
};
