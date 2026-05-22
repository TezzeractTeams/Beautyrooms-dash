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
        subtitle="KPIs from Google Ad report & Meta campaigns (May 15–22, 2026)"
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
