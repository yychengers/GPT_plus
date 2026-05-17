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
          ? "border-[#8a6a38] bg-[#2a1b10] text-[#ffd28a]"
          : "border-[#8f2c20] bg-[#2b0f0c] text-[#ffb3a8]",
      )}
    >
      {children}
    </span>
  );
}
