/** Filter platforms — Boulevard reserved for future API */
export type Platform = "all" | "meta" | "google" | "boulevard";

export type DateRangePreset = "today" | "7d" | "30d" | "90d" | "custom";

export interface DateRange {
  preset: DateRangePreset;
  start?: string;
  end?: string;
}

export type TrendDirection = "up" | "down" | "neutral";

export type CampaignStatus = "active" | "paused" | "ended";

export type MetricSource = "meta" | "google" | "combined" | "hubspot" | "boulevard";

export type KpiValueFormat = "currency" | "currencyDecimal" | "number" | "percent";

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  format: KpiValueFormat;
  trendPercent: number;
  trendDirection: TrendDirection;
  source: MetricSource;
}

export interface LeadStage {
  id: "mql" | "sql" | "booked";
  label: string;
  count: number;
  percentOfTop: number;
  dropOffFromPrevious: number | null;
}

export interface LeadsFunnelData {
  stages: LeadStage[];
  source: "hubspot";
}

export interface MetaChartPoint {
  date: string;
  cost: number;
  cpm: number;
}

export interface GoogleChartPoint {
  date: string;
  cost: number;
  impressions: number;
  clicks: number;
}

export interface MetaCampaignRow {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: string;
  spend: string;
  impressions: number;
  clicks: number;
  ctr: string;
  cpc: string;
  conversions: number;
  roas: string;
}

export interface MetaAdSetRow {
  id: string;
  campaignName: string;
  name: string;
  status: CampaignStatus;
  budget: string;
  spend: string;
  impressions: number;
  clicks: number;
  ctr: string;
  cpc: string;
  conversions: number;
  roas: string;
}

export interface MetaAdRow {
  id: string;
  campaignName: string;
  adSetName: string;
  name: string;
  status: CampaignStatus;
  budget: string;
  spend: string;
  impressions: number;
  clicks: number;
  ctr: string;
  cpc: string;
  conversions: number;
  roas: string;
}

export interface GoogleCampaignRow {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: string;
  impressions: number;
  clicks: number;
  ctr: string;
  avgCpc: string;
  conversions: number;
  costPerConversion: string;
  impressionShare: string;
}

export interface GoogleAdRow {
  id: string;
  campaignName: string;
  name: string;
  status: CampaignStatus;
  budget: string;
  impressions: number;
  clicks: number;
  ctr: string;
  avgCpc: string;
  conversions: number;
  costPerConversion: string;
  impressionShare: string;
}

export interface GoogleAdUnitRow {
  id: string;
  campaignName: string;
  adName: string;
  name: string;
  status: CampaignStatus;
  budget: string;
  impressions: number;
  clicks: number;
  ctr: string;
  avgCpc: string;
  conversions: number;
  costPerConversion: string;
  impressionShare: string;
}

export type TLDRSentiment = "positive" | "neutral" | "negative";

export interface TLDRBullet {
  id: string;
  text: string;
  sentiment: TLDRSentiment;
}

export interface TLDRContent {
  summary: TLDRBullet[];
  predictions: TLDRBullet[];
}

export interface DashboardData {
  overallStats: KpiMetric[];
  leadsFunnel: LeadsFunnelData;
  metaChart: MetaChartPoint[];
  metaCampaigns: MetaCampaignRow[];
  metaAdSets: MetaAdSetRow[];
  metaAds: MetaAdRow[];
  googleChart: GoogleChartPoint[];
  googleCampaigns: GoogleCampaignRow[];
  googleAds: GoogleAdRow[];
  googleAdUnits: GoogleAdUnitRow[];
  tldr: TLDRContent;
  filters: {
    platform: Platform;
    dateRange: DateRange;
  };
}
