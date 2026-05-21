import type { DashboardData } from "@/types/dashboard";
import { mockConversionMetrics } from "./boulevard";
import {
  mockGaImpCycleSeries,
  mockGoogleAdGroups,
  mockGoogleAds,
  mockGoogleCampaigns,
} from "./google-ads";
import { mockLeadStages } from "./hubspot-leads";
import {
  mockMetaAdGroups,
  mockMetaAds,
  mockMetaCampaigns,
  mockNetCostCpmSeries,
} from "./meta-ads";
import { mockSummaryKpis } from "./summary";

/**
 * Aggregated dashboard payload.
 * Replace this function with parallel API calls to HubSpot, Meta, Google Ads, and Boulevard.
 */
export function getDashboardData(): DashboardData {
  return {
    summary: mockSummaryKpis,
    leadsKpi: {
      title: "Leads KPI",
      stages: mockLeadStages,
      source: "hubspot",
    },
    netCostCpm: {
      title: "Net & Cost CPM",
      points: mockNetCostCpmSeries,
      source: "meta",
    },
    conversions: {
      title: "Conv.",
      metrics: mockConversionMetrics,
      source: "boulevard",
    },
    gaImpCycle: {
      title: "G.A.",
      subtitle: "Imp Cycle",
      points: mockGaImpCycleSeries,
      source: "google",
    },
    leftTabs: {
      campaigns: mockMetaCampaigns,
      ads: mockMetaAds,
      adGroups: mockMetaAdGroups,
    },
    rightTabs: {
      campaigns: mockGoogleCampaigns,
      ads: mockGoogleAds,
      adGroups: mockGoogleAdGroups,
    },
  };
}
