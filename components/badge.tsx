import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "warm";
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-xs font-medium",
        tone === "default"
          ? "border-[#b8cac5] bg-[#e7f0ed] text-[#0f5f59]"
          : "border-[#e4c690] bg-[#fff2d9] text-[#8a4a04]",
      )}
    >
      {children}
    </span>
  );
}
