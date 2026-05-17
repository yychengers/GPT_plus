import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, children, icon, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 border px-4 py-2 text-sm font-semibold transition",
        variant === "primary"
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-[#0c625c]"
          : "border-[var(--line)] bg-[var(--panel)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
