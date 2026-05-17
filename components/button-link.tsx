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
        variant === "primary" ? "infernal-button" : "iron-button",
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
