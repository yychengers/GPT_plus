import Link from "next/link";
import { BookOpen, PenSquare } from "lucide-react";
import type { BlogSettings } from "@/lib/types";

type ShellProps = {
  children: React.ReactNode;
  settings: BlogSettings;
};

export function Shell({ children, settings }: ShellProps) {
  return (
    <div className="infernal-shell min-h-screen">
      <header className="border-b border-[rgba(194,138,53,0.28)] bg-[rgba(10,6,5,0.88)] shadow-[0_12px_32px_rgba(0,0,0,0.34)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[#f3ddbb] hover:text-[#ffd28a]">
            <BookOpen size={20} className="text-[var(--warm)]" aria-hidden="true" />
            <span className="gothic-title">{settings.title}</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link className="px-3 py-2 text-sm text-[var(--muted)] hover:text-[#ffd28a]" href="/">
              日志
            </Link>
            <Link
              className="iron-button inline-flex items-center gap-2 px-3 py-2 text-sm font-medium"
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
