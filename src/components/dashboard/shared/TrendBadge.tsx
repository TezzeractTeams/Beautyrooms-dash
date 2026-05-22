import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { KpiMetric, TrendDirection } from "@/types/dashboard";
import { cn } from "@/lib/utils";

/** Metrics where an upward trend is typically negative for the business */
const INVERT_TREND_GOOD: Set<string> = new Set([
  "total-cost",
  "daily-cost",
  "cpc",
  "cpm",
]);

interface TrendBadgeProps {
  metricId: string;
  trendPercent: number;
  trendDirection: TrendDirection;
  className?: string;
}

function sentiment(metricId: string, direction: TrendDirection): "positive" | "negative" | "neutral" {
  if (direction === "neutral") return "neutral";
  const upIsGood = !INVERT_TREND_GOOD.has(metricId);
  if (direction === "up") return upIsGood ? "positive" : "negative";
  return upIsGood ? "negative" : "positive";
}

export function TrendBadge({
  metricId,
  trendPercent,
  trendDirection,
  className,
}: TrendBadgeProps) {
  const mood = sentiment(metricId, trendDirection);
  const Icon =
    trendDirection === "up" ? ArrowUp : trendDirection === "down" ? ArrowDown : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-sans text-sm tracking-wide",
        mood === "positive" && "text-status-positive",
        mood === "negative" && "text-status-negative",
        mood === "neutral" && "text-status-warning",
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={1.5} aria-hidden />
      {Math.abs(trendPercent).toFixed(1)}%
    </span>
  );
}

export function trendLabel(metric: KpiMetric): string {
  const dir =
    metric.trendDirection === "up"
      ? "up"
      : metric.trendDirection === "down"
        ? "down"
        : "flat";
  return `${Math.abs(metric.trendPercent)}% ${dir} vs previous period`;
}
