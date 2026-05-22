"use client";

import { useMemo } from "react";
import { useDashboardFilters } from "@/contexts/dashboard-filters";
import { getOverallStats } from "@/lib/mock-data";
import { FilterableSection } from "../shared/FilterableSection";
import { SectionHeader } from "../shared/SectionHeader";
import { StatsRow } from "./StatsRow";

export function OverallStatsSection() {
  const { platform, dateRange } = useDashboardFilters();

  const metrics = useMemo(
    () => getOverallStats(platform, dateRange),
    [platform, dateRange],
  );

  return (
    <section>
      <SectionHeader
        title="Overall Stats"
        subtitle="High-level KPIs across Meta, Google, and clinic conversions"
      />
      <FilterableSection skeletonVariant="stats">
        <StatsRow
          metrics={metrics}
          platform={platform}
          animationKey={`${platform}-${dateRange.preset}-${dateRange.start ?? ""}-${dateRange.end ?? ""}`}
        />
      </FilterableSection>
    </section>
  );
}
