import type { DashboardData } from "@/types/dashboard";
import { ChartPanel } from "./chart-panel";
import { ConversionsPanel } from "./conversions-panel";
import { KpiSummaryRow } from "./kpi-summary-row";
import { LeadsKpiPanel } from "./leads-kpi-panel";
import { TabbedListPanel } from "./tabbed-list-panel";

interface DashboardViewProps {
  data: DashboardData;
}

export function DashboardView({ data }: DashboardViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
      <KpiSummaryRow columns={data.summary} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left column — Hub leads + Meta ads */}
        <div className="flex flex-col gap-6">
          <LeadsKpiPanel
            title={data.leadsKpi.title}
            stages={data.leadsKpi.stages}
            source={data.leadsKpi.source}
          />
          <ChartPanel
            title={data.netCostCpm.title}
            points={data.netCostCpm.points}
            source={data.netCostCpm.source}
          />
          <TabbedListPanel title="Meta Ads" data={data.leftTabs} />
        </div>

        {/* Right column — Boulevard conv + Google ads */}
        <div className="flex flex-col gap-6">
          <ConversionsPanel
            title={data.conversions.title}
            metrics={data.conversions.metrics}
            source={data.conversions.source}
          />
          <ChartPanel
            title={data.gaImpCycle.title}
            subtitle={data.gaImpCycle.subtitle}
            points={data.gaImpCycle.points}
            source={data.gaImpCycle.source}
          />
          <TabbedListPanel title="Google Ads" data={data.rightTabs} />
        </div>
      </div>
    </div>
  );
}
