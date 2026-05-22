"use client";

import { ChevronDown } from "lucide-react";
import type { KpiMetric } from "@/types/dashboard";
import { formatKpiValue } from "@/lib/format-kpi";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";
import { SourceBadge } from "../shared/SourceBadge";
import { TrendBadge, trendLabel } from "../shared/TrendBadge";
import { SparklineStub } from "./SparklineStub";

interface StatCardProps {
  metric: KpiMetric;
  availableMetrics: KpiMetric[];
  onMetricChange: (metricId: string) => void;
  animate?: boolean;
  staggerIndex?: number;
}

export function StatCard({
  metric,
  availableMetrics,
  onMetricChange,
  animate = true,
  staggerIndex = 0,
}: StatCardProps) {
  const animated = useCountUp(metric.rawValue, 700, animate);
  const display = formatKpiValue(animated, metric.format);

  return (
    <article
      className={cn(
        "dashboard-fade-up group relative border border-[rgba(103,92,83,0.08)] bg-surface p-5 sm:p-6 md:p-7",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
      )}
      style={{ ["--enter-delay" as string]: `${Math.min(staggerIndex, 11) * 40}ms` }}
      title={trendLabel(metric)}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="relative min-w-0 flex-1">
          <label className="sr-only" htmlFor={`stat-metric-${metric.id}`}>
            Select metric
          </label>
          <select
            id={`stat-metric-${metric.id}`}
            value={metric.id}
            onChange={(e) => onMetricChange(e.target.value)}
            className={cn(
              "w-full cursor-pointer appearance-none bg-transparent pr-6 font-sans text-xs tracking-[0.12em] uppercase text-[#888888]",
              "transition-colors hover:text-warm-brown focus:text-warm-brown focus:outline-none",
            )}
          >
            {availableMetrics.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 top-1/2 size-3.5 -translate-y-1/2 text-warm-brown/60"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <SourceBadge source={metric.source} className="shrink-0" />
      </div>

      <p className="font-sans text-2xl font-extralight tracking-[-0.02em] text-[#2D2926] sm:text-3xl md:text-4xl">
        {display}
      </p>

      <div className="mt-4">
        <TrendBadge
          metricId={metric.id}
          trendPercent={metric.trendPercent}
          trendDirection={metric.trendDirection}
        />
        <span className="ml-2 font-sans text-xs text-[#888888]">vs prev. period</span>
      </div>

      <SparklineStub metricId={metric.id} />
    </article>
  );
}
