import type { DataSource } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const SOURCE_LABELS: Record<DataSource, string> = {
  hubspot: "Hub",
  meta: "Meta",
  google: "Google",
  boulevard: "Blvd",
};

interface SourceBadgeProps {
  source: DataSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <span
      className={cn(
        "font-barlow text-[10px] tracking-[0.12em] uppercase text-[#888888]",
        className,
      )}
    >
      ← {SOURCE_LABELS[source]}
    </span>
  );
}
