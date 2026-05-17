import { getAllPosts, getSettings } from "@/lib/blog-store";
import { Shell } from "@/components/shell";
import { WriteForm } from "@/components/write-form";

export default async function WritePage() {
  const [posts, settings] = await Promise.all([getAllPosts(), getSettings()]);

  return (
    <Shell settings={settings}>
      <section className="py-8 lg:py-12">
        <div className="mb-6">
          <h1 className="gothic-title text-4xl font-semibold tracking-normal">写日志</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            先提供一个基础编辑入口：创建日志、设置发布状态、自动生成分享 token。后续可以加草稿箱、图片上传和富文本编辑器。
          </p>
        </div>
        <WriteForm initialPosts={posts} />
      </section>
    </Shell>
  );
}
