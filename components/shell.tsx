import Link from "next/link";
import { BookOpen, PenSquare } from "lucide-react";
import type { BlogSettings } from "@/lib/types";

type ShellProps = {
  children: React.ReactNode;
  settings: BlogSettings;
};

export function Shell({ children, settings }: ShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[rgba(247,244,239,0.88)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen size={20} aria-hidden="true" />
            <span>{settings.title}</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link className="px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--accent)]" href="/">
              日志
            </Link>
            <Link
              className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)]"
              href="/write"
            >
              <PenSquare size={16} aria-hidden="true" />
              写作
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
