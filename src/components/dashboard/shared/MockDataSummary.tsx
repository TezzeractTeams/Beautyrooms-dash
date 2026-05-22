import type { DashboardData } from "@/types/dashboard";

interface MockDataSummaryProps {
  data: DashboardData;
}

/** Dev-facing summary until Phase 3+ components consume real data */
export function MockDataSummary({ data }: MockDataSummaryProps) {
  return (
    <p className="mb-6 font-sans text-xs font-light text-[#2D2926]/50">
      Mock data loaded — {data.overallStats.length} KPIs · {data.leadsFunnel.stages.length}{" "}
      funnel stages · {data.metaCampaigns.length} Meta campaigns ·{" "}
      {data.metaAdSets.length} ad sets · {data.metaAds.length} Meta ads ·{" "}
      {data.googleCampaigns.length} Google campaigns · {data.googleAds.length} Google ads ·{" "}
      {data.googleAdUnits.length} ad units · {data.metaChart.length} chart points ·{" "}
      {data.tldr.summary.length} TLDR bullets
    </p>
  );
}
