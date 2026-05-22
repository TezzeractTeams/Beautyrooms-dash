import type { DashboardData, DateRange, Platform } from "@/types/dashboard";
import { getGoogleAdUnits, getGoogleAds, getGoogleCampaigns, getGoogleChartData } from "./google-ads";
import { getLeadsFunnelData } from "./leads-funnel";
import {
  getMetaAdSets,
  getMetaAds,
  getMetaCampaigns,
  getMetaChartData,
} from "./meta-ads";
import { getOverallStats } from "./overall-stats";
import { getTLDRContent } from "./tldr-content";

export interface DashboardFilters {
  platform?: Platform;
  dateRange?: DateRange;
}

export function getDashboardData(
  filters: DashboardFilters = {},
): DashboardData {
  const platform = filters.platform ?? "all";
  const dateRange = filters.dateRange ?? { preset: "30d" };

  return {
    overallStats: getOverallStats(platform, dateRange),
    leadsFunnel: getLeadsFunnelData(),
    metaChart: getMetaChartData("combined", dateRange),
    metaCampaigns: getMetaCampaigns(),
    metaAdSets: getMetaAdSets(),
    metaAds: getMetaAds(),
    googleChart: getGoogleChartData(dateRange),
    googleCampaigns: getGoogleCampaigns(),
    googleAds: getGoogleAds(),
    googleAdUnits: getGoogleAdUnits(),
    tldr: getTLDRContent(platform, dateRange),
    filters: { platform, dateRange },
  };
}

export { getOverallStats } from "./overall-stats";
export { getLeadsFunnelData } from "./leads-funnel";
export {
  getMetaChartData,
  getMetaCampaigns,
  getMetaAdSets,
  getMetaAds,
} from "./meta-ads";
export {
  getGoogleChartData,
  getGoogleCampaigns,
  getGoogleAds,
  getGoogleAdUnits,
} from "./google-ads";
export { getTLDRContent, refreshTLDRContent } from "./tldr-content";
