import type { PostInput, PostStatus } from "@/lib/types";
import { slugify } from "@/lib/slug";

type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

const statuses = new Set<PostStatus>(["draft", "public", "unlisted"]);

export const postInputSchema = {
  safeParse(input: unknown): ValidationResult<PostInput> {
    if (!isRecord(input)) {
      return { success: false, error: "Invalid payload" };
    }

    const title = readString(input.title);
    const slug = slugify(readString(input.slug || input.title));
    const excerpt = readString(input.excerpt);
    const content = readString(input.content);
    const status = input.status;
    const tags = Array.isArray(input.tags)
      ? input.tags.map((tag) => readString(tag)).filter(Boolean)
      : [];

    if (!title || !slug || !excerpt || !content) {
      return { success: false, error: "Title, slug, excerpt and content are required" };
    }

    if (!statuses.has(status as PostStatus)) {
      return { success: false, error: "Invalid status" };
    }

    return {
      success: true,
      data: {
        title,
        slug,
        excerpt,
        content,
        tags,
        status: status as PostStatus,
      },
    };
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
