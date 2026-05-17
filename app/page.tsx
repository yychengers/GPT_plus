import Link from "next/link";
import { ArrowRight, BookOpen, Link2, PencilLine, Tag } from "lucide-react";
import { getAllPosts, getSettings } from "@/lib/blog-store";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/badge";
import { ButtonLink } from "@/components/button-link";
import { Shell } from "@/components/shell";

export default async function HomePage() {
  const [posts, settings] = await Promise.all([getAllPosts(), getSettings()]);
  const publicPosts = posts.filter((post) => post.status !== "draft");
  const pinnedPost = publicPosts.find((post) => post.pinned) ?? publicPosts[0];

  return (
    <Shell settings={settings}>
      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-12">
        <div className="min-w-0">
          <div className="mb-8 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-sm text-[var(--muted)]">
              <BookOpen size={16} aria-hidden="true" />
              {settings.description}
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-[var(--foreground)] sm:text-5xl">
              {settings.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
              记录日常、复盘项目、保存想法。公开日志会出现在首页，未列出日志可以通过分享链接单独访问。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/write" icon={<PencilLine size={18} />}>
                写一篇日志
              </ButtonLink>
              {pinnedPost ? (
                <ButtonLink href={`/post/${pinnedPost.slug}`} variant="secondary" icon={<ArrowRight size={18} />}>
                  阅读置顶
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            {publicPosts.map((post) => (
              <article
                key={post.id}
                className="border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm transition hover:border-[#a7b8b1]"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                  <time dateTime={post.publishedAt ?? post.updatedAt}>
                    {formatDate(post.publishedAt ?? post.updatedAt)}
                  </time>
                  <span>/</span>
                  <span>{post.readingMinutes} 分钟阅读</span>
                  {post.status === "unlisted" ? <Badge tone="warm">仅链接可见</Badge> : null}
                  {post.pinned ? <Badge>置顶</Badge> : null}
                </div>
                <Link href={`/post/${post.slug}`} className="group block">
                  <h2 className="text-2xl font-semibold leading-tight group-hover:text-[var(--accent)]">
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
                </Link>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-sm text-[var(--muted)]">
                      <Tag size={14} aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm lg:sticky lg:top-6">
          <h2 className="text-sm font-semibold uppercase tracking-normal text-[var(--muted)]">分享链接</h2>
          <div className="mt-4 space-y-3">
            {settings.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between border border-[var(--line)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                <span>{link.label}</span>
                <Link2 size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
            链接配置在 <code className="bg-[var(--soft)] px-1 py-0.5">data/settings.json</code>，后续可以接后台配置页。
          </p>
        </aside>
      </section>
    </Shell>
  );
}
