import { markdownToHtml } from "@/lib/markdown";

type MarkdownBodyProps = {
  content: string;
};

export function MarkdownBody({ content }: MarkdownBodyProps) {
  return (
    <div
      className="prose-log mt-8 max-w-none text-base"
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  );
}
