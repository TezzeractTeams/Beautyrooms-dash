"use client";

import type { KpiMetric, Platform } from "@/types/dashboard";
import { useStatCardSlots } from "@/hooks/useStatCardSlots";
import { StatCard } from "./StatCard";

interface StatsRowProps {
  metrics: KpiMetric[];
  platform: Platform;
  /** Re-trigger count-up when filters change */
  animationKey?: string;
}

export function StatsRow({ metrics, platform, animationKey }: StatsRowProps) {
  const { slotMetrics, slots, setSlotMetric, availableMetrics } =
    useStatCardSlots(metrics, platform);

  if (metrics.length === 0) {
    return (
      <p className="font-sans text-base font-light text-[#2D2926]/65">
        No metrics for this platform in the current period.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
      {slotMetrics.map((metric, index) => (
        <StatCard
          key={`${animationKey ?? "default"}-${slots[index]}-${index}`}
          metric={metric}
          availableMetrics={availableMetrics}
          onMetricChange={(id) => setSlotMetric(index, id)}
          staggerIndex={index}
        />
      ))}
    </div>
  );
}
