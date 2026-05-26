"use client";

import { useEffect, useMemo, useState } from "react";
import { useDashboardFilters } from "@/contexts/dashboard-filters";
import { getOverallStats } from "@/lib/mock-data";
import { FilterableSection } from "../shared/FilterableSection";
import { SectionHeader } from "../shared/SectionHeader";
import { SectionSkeleton } from "../shared/SectionSkeleton";
import { StatsRow } from "./StatsRow";
import { useMetaOverview } from "./useMetaOverview";

function formatReportDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OverallStatsSection() {
  const { platform, dateRange } = useDashboardFilters();
  const { totals: metaTotals, loading: metaLoading, sessionLoading } = useMetaOverview(dateRange);
  const [reportDate, setReportDate] = useState<string | null>(null);

  useEffect(() => {
    setReportDate(formatReportDate());
  }, []);

  const metrics = useMemo(
    () => getOverallStats(platform, dateRange, metaTotals),
    [platform, dateRange, metaTotals],
  );

  const animationKey = `${platform}-${dateRange.preset}-${dateRange.start ?? ""}-${dateRange.end ?? ""}-${metaTotals ? "live" : "mock"}`;

  const subtitle = metaTotals
    ? `Live Meta Ads data · Google mock data${reportDate ? ` · ${reportDate}` : ""}`
    : "Google Ad report & Meta campaigns (sample data — connect Meta to see live stats)";

  return (
    <section>
      <SectionHeader title="Overall Stats" subtitle={subtitle} />
      <FilterableSection skeletonVariant="stats">
        {sessionLoading || metaLoading ? (
          <SectionSkeleton variant="stats" />
        ) : (
          <StatsRow
            metrics={metrics}
            platform={platform}
            animationKey={animationKey}
          />
        )}
      </FilterableSection>
    </section>
  );
}
