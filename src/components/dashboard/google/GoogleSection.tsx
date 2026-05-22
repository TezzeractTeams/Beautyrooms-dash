"use client";

import { useState } from "react";
import type {
  GoogleAdRow,
  GoogleAdUnitRow,
  GoogleCampaignRow,
  GoogleChartPoint,
} from "@/types/dashboard";
import { ResponsiveTablePanel } from "../shared/ResponsiveTablePanel";
import { GoogleChart } from "./GoogleChart";
import {
  googleAdColumns,
  googleAdUnitColumns,
  googleCampaignColumns,
} from "./google-table-columns";

type GoogleTab = "campaigns" | "ads" | "adUnits";

const TABS = [
  { value: "campaigns" as const, label: "Campaign" },
  { value: "ads" as const, label: "Ads" },
  { value: "adUnits" as const, label: "Ad" },
];

interface GoogleSectionProps {
  chartData: GoogleChartPoint[];
  campaigns: GoogleCampaignRow[];
  ads: GoogleAdRow[];
  adUnits: GoogleAdUnitRow[];
  showChart?: boolean;
  showTables?: boolean;
}

export function GoogleSection({
  chartData,
  campaigns,
  ads,
  adUnits,
  showChart = true,
  showTables = true,
}: GoogleSectionProps) {
  const [tab, setTab] = useState<GoogleTab>("campaigns");

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {showChart ? <GoogleChart data={chartData} /> : null}

      {showTables ? (
        <ResponsiveTablePanel
          tabs={TABS}
          activeTab={tab}
          onTabChange={setTab}
          source="google"
          ariaLabel="Google tables"
          tables={{
            campaigns: {
              rows: campaigns,
              columns: googleCampaignColumns,
              getRowKey: (r) => r.id,
              tableId: "google-campaigns",
            },
            ads: {
              rows: ads,
              columns: googleAdColumns,
              getRowKey: (r) => r.id,
              tableId: "google-ads",
            },
            adUnits: {
              rows: adUnits,
              columns: googleAdUnitColumns,
              getRowKey: (r) => r.id,
              tableId: "google-ad-units",
            },
          }}
        />
      ) : null}
    </div>
  );
}
