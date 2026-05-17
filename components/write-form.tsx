"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Check, Copy, Loader2, Save } from "lucide-react";
import type { BlogPost, PostStatus } from "@/lib/types";
import { slugify } from "@/lib/slug";

type WriteFormProps = {
  initialPosts: BlogPost[];
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  status: PostStatus;
  content: string;
};

const starterContent = `今天想记录：

## 发生了什么

- 

## 我学到了什么

- 

## 下一步

- 
`;

export function WriteForm({ initialPosts }: WriteFormProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    excerpt: "",
    tags: "",
    status: "draft",
    content: starterContent,
  });

  const selectedPost = useMemo(() => posts.find((post) => post.slug === selectedSlug), [posts, selectedSlug]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      if (key === "title" && !selectedPost && (!current.slug || current.slug === slugify(current.title))) {
        return { ...current, title: value, slug: slugify(String(value)) };
      }

      return { ...current, [key]: value };
    });
  }

  function loadPost(slug: string) {
    const post = posts.find((item) => item.slug === slug);
    setSelectedSlug(slug);
    setNotice("");

    if (!post) {
      setForm({
        title: "",
        slug: "",
        excerpt: "",
        tags: "",
        status: "draft",
        content: starterContent,
      });
      return;
    }

    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      tags: post.tags.join(", "),
      status: post.status,
      content: post.content,
    });
  }

  function resetForm() {
    setSelectedSlug("");
    setNotice("");
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      tags: "",
      status: "draft",
      content: starterContent,
    });
  }

  async function submitForm() {
    setNotice("");
    setCopied(false);

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      const endpoint = selectedPost ? `/api/posts/${selectedPost.slug}` : "/api/posts";
      const method = selectedPost ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setNotice("保存失败，请检查标题、slug 和正文是否填写完整。");
        return;
      }

      const data = (await response.json()) as { post: BlogPost };
      setPosts((current) => {
        const next = current.filter((post) => post.id !== data.post.id);
        return [data.post, ...next].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      });
      setSelectedSlug(data.post.slug);
      setForm({
        title: data.post.title,
        slug: data.post.slug,
        excerpt: data.post.excerpt,
        tags: data.post.tags.join(", "),
        status: data.post.status,
        content: data.post.content,
      });
      setNotice("已保存。");
    });
  }

  async function copyShareLink() {
    if (!selectedPost) {
      return;
    }

    const url = `${window.location.origin}/share/${selectedPost.shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="h-fit border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm lg:sticky lg:top-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[var(--muted)]">已有日志</h2>
          <button className="text-sm font-medium text-[var(--accent)]" type="button" onClick={resetForm}>
            新建
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {posts.map((post) => (
            <button
              key={post.id}
              className="w-full border border-[var(--line)] px-3 py-2 text-left text-sm hover:border-[var(--accent)]"
              type="button"
              onClick={() => loadPost(post.slug)}
            >
              <span className="block truncate font-medium">{post.title}</span>
              <span className="mt-1 block text-xs text-[var(--muted)]">{post.status}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-4">
        <div className="grid gap-4 border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-medium">标题</span>
            <input
              className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-3 outline-none focus:border-[var(--accent)]"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="今天的日志标题"
            />
          </label>
          <label>
            <span className="text-sm font-medium">Slug</span>
            <input
              className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-3 outline-none focus:border-[var(--accent)]"
              value={form.slug}
              onChange={(event) => updateField("slug", slugify(event.target.value))}
              placeholder="my-daily-note"
            />
          </label>
          <label>
            <span className="text-sm font-medium">状态</span>
            <select
              className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-3 outline-none focus:border-[var(--accent)]"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value as PostStatus)}
            >
              <option value="draft">草稿</option>
              <option value="public">公开</option>
              <option value="unlisted">仅链接可见</option>
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium">摘要</span>
            <input
              className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-3 outline-none focus:border-[var(--accent)]"
              value={form.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              placeholder="一句话记录这篇日志讲什么"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium">标签</span>
            <input
              className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-3 outline-none focus:border-[var(--accent)]"
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="生活, 项目, 复盘"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium">正文 Markdown</span>
            <textarea
              className="mt-2 min-h-[420px] w-full resize-y border border-[var(--line)] bg-white px-3 py-3 leading-7 outline-none focus:border-[var(--accent)]"
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c625c] disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={submitForm}
            disabled={isPending}
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            保存日志
          </button>
          {selectedPost ? (
            <>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)]"
                type="button"
                onClick={copyShareLink}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "已复制" : "复制分享链接"}
              </button>
              <Link className="text-sm font-medium text-[var(--accent)]" href={`/post/${selectedPost.slug}`}>
                预览文章
              </Link>
            </>
          ) : null}
          {notice ? <span className="text-sm text-[var(--muted)]">{notice}</span> : null}
        </div>
      </div>
    </div>
  );
}
