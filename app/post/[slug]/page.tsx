import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Link2 } from "lucide-react";
import { getPostBySlug, getSettings } from "@/lib/blog-store";
import { formatDate } from "@/lib/date";
import { MarkdownBody } from "@/components/markdown-body";
import { Shell } from "@/components/shell";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()]);

  if (!post || post.status === "draft") {
    notFound();
  }

  const sharePath = `/share/${post.shareToken}`;

  return (
    <Shell settings={settings}>
      <article className="mx-auto max-w-3xl py-8 lg:py-12">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[#ffd28a]">
          <ArrowLeft size={16} aria-hidden="true" />
          返回日志列表
        </Link>
        <div className="relic-panel p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <time dateTime={post.publishedAt ?? post.updatedAt}>{formatDate(post.publishedAt ?? post.updatedAt)}</time>
            <span>/</span>
            <span>{post.readingMinutes} 分钟阅读</span>
          </div>
          <h1 className="gothic-title text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">{post.excerpt}</p>
          <Link
            href={sharePath}
            className="iron-button mt-6 inline-flex items-center gap-2 px-3 py-2 text-sm"
          >
            <Link2 size={16} aria-hidden="true" />
            打开分享页
          </Link>
        </div>
        <MarkdownBody content={post.content} />
      </article>
    </Shell>
  );
}
