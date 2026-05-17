import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BlogPost, BlogSettings, PostInput } from "@/lib/types";
import { makeShareToken, slugify } from "@/lib/slug";

const dataDir = path.join(process.cwd(), "data");
const postsPath = path.join(dataDir, "posts.json");
const settingsPath = path.join(dataDir, "settings.json");

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await readJsonFile<BlogPost[]>(postsPath, []);
  return posts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostByShareToken(token: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.shareToken === token);
}

export async function createPost(input: PostInput): Promise<BlogPost> {
  const posts = await getAllPosts();
  const now = new Date().toISOString();
  const slug = uniqueSlug(slugify(input.slug || input.title), posts);
  const post: BlogPost = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    tags: input.tags,
    status: input.status,
    pinned: false,
    shareToken: makeShareToken(),
    readingMinutes: estimateReadingMinutes(input.content),
    publishedAt: input.status === "draft" ? null : now,
    createdAt: now,
    updatedAt: now,
  };

  await writePosts([post, ...posts]);
  return post;
}

export async function updatePost(slug: string, input: PostInput): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  const current = posts.find((post) => post.slug === slug);

  if (!current) {
    return undefined;
  }

  const now = new Date().toISOString();
  const nextSlug = uniqueSlug(slugify(input.slug || input.title), posts.filter((post) => post.id !== current.id));
  const updated: BlogPost = {
    ...current,
    title: input.title.trim(),
    slug: nextSlug,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    tags: input.tags,
    status: input.status,
    readingMinutes: estimateReadingMinutes(input.content),
    publishedAt: current.publishedAt ?? (input.status === "draft" ? null : now),
    updatedAt: now,
  };

  await writePosts(posts.map((post) => (post.id === current.id ? updated : post)));
  return updated;
}

export async function deletePost(slug: string): Promise<boolean> {
  const posts = await getAllPosts();
  const nextPosts = posts.filter((post) => post.slug !== slug);

  if (nextPosts.length === posts.length) {
    return false;
  }

  await writePosts(nextPosts);
  return true;
}

export async function getSettings(): Promise<BlogSettings> {
  return readJsonFile<BlogSettings>(settingsPath, {
    title: "Personal Log",
    description: "私人日志与公开分享空间",
    author: "Me",
    links: [],
  });
}

async function writePosts(posts: BlogPost[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(postsPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

function uniqueSlug(baseSlug: string, posts: BlogPost[]) {
  const fallbackSlug = baseSlug || "untitled";
  const existing = new Set(posts.map((post) => post.slug));

  if (!existing.has(fallbackSlug)) {
    return fallbackSlug;
  }

  let count = 2;
  while (existing.has(`${fallbackSlug}-${count}`)) {
    count += 1;
  }

  return `${fallbackSlug}-${count}`;
}

function estimateReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  return Math.max(1, Math.ceil((words + chineseChars / 2) / 220));
}
