import type { MetricSource } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const LABELS: Record<MetricSource, string> = {
  meta: "Meta",
  google: "Google",
  combined: "Combined",
  hubspot: "Hub",
  boulevard: "Blvd",
};

interface SourceBadgeProps {
  source: MetricSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 font-sans text-xs tracking-wide",
        "border border-border bg-muted text-warm-brown",
        className,
      )}
    >
      {LABELS[source]}
    </span>
  );
}
