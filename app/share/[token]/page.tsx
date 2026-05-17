import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getPostByShareToken, getSettings } from "@/lib/blog-store";
import { formatDate } from "@/lib/date";
import { MarkdownBody } from "@/components/markdown-body";
import { Shell } from "@/components/shell";

type SharePageProps = {
  params: Promise<{ token: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const [post, settings] = await Promise.all([getPostByShareToken(token), getSettings()]);

  if (!post || post.status === "draft") {
    notFound();
  }

  return (
    <Shell settings={settings}>
      <article className="mx-auto max-w-3xl py-8 lg:py-12">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[#ffd28a]">
          <ArrowLeft size={16} aria-hidden="true" />
          返回首页
        </Link>
        <div className="relic-panel p-5">
          <div className="rune-kicker mb-3 inline-flex items-center gap-2 px-3 py-1 text-sm">
            <ExternalLink size={16} aria-hidden="true" />
            分享阅读页
          </div>
          <h1 className="gothic-title text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            发布于 {formatDate(post.publishedAt ?? post.updatedAt)}，{post.readingMinutes} 分钟阅读。
          </p>
        </div>
        <MarkdownBody content={post.content} />
      </article>
    </Shell>
  );
}
