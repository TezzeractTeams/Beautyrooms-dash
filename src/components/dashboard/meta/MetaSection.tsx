"use client";

import { useState } from "react";
import type { MetaAdRow, MetaAdSetRow, MetaCampaignRow, MetaChartPoint } from "@/types/dashboard";
import { ResponsiveTablePanel } from "../shared/ResponsiveTablePanel";
import { MetaChart } from "./MetaChart";
import {
  metaAdColumns,
  metaAdSetColumns,
  metaCampaignColumns,
} from "./meta-table-columns";

type MetaTab = "campaigns" | "adSets" | "ads";

const TABS = [
  { value: "campaigns" as const, label: "Campaign" },
  { value: "adSets" as const, label: "Ad sets" },
  { value: "ads" as const, label: "Ads" },
];

interface MetaSectionProps {
  chartData: MetaChartPoint[];
  campaigns: MetaCampaignRow[];
  adSets: MetaAdSetRow[];
  ads: MetaAdRow[];
  showChart?: boolean;
  showTables?: boolean;
}

export function MetaSection({
  chartData,
  campaigns,
  adSets,
  ads,
  showChart = true,
  showTables = true,
}: MetaSectionProps) {
  const [tab, setTab] = useState<MetaTab>("campaigns");

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {showChart ? <MetaChart data={chartData} /> : null}

      {showTables ? (
        <ResponsiveTablePanel
          tabs={TABS}
          activeTab={tab}
          onTabChange={setTab}
          source="meta"
          ariaLabel="Meta tables"
          tables={{
            campaigns: {
              rows: campaigns,
              columns: metaCampaignColumns,
              getRowKey: (r) => r.id,
              tableId: "meta-campaigns",
              emptyMessage: "No campaigns found for this period.",
            },
            adSets: {
              rows: adSets,
              columns: metaAdSetColumns,
              getRowKey: (r) => r.id,
              tableId: "meta-ad-sets",
              emptyMessage: "No ad sets found for this period.",
            },
            ads: {
              rows: ads,
              columns: metaAdColumns,
              getRowKey: (r) => r.id,
              tableId: "meta-ads",
              emptyMessage: "No ads found for this period.",
            },
          }}
        />
      ) : null}
    </div>
  );
}
