import type {
  DateRange,
  GoogleAdRow,
  GoogleAdUnitRow,
  GoogleCampaignRow,
  GoogleChartPoint,
} from "@/types/dashboard";

/** Google Ads — Ad report (May 15–21, 2026) */
const REPORT_START = "2026-05-15";
const REPORT_END = "2026-05-21";
const REPORT_DAYS = ["2026-05-15", "2026-05-16", "2026-05-17", "2026-05-18", "2026-05-19", "2026-05-20", "2026-05-21"];

const ACCOUNT_TOTALS = {
  cost: 22.47,
  impressions: 205,
  clicks: 7,
  conversions: 4,
  ctr: "3.41%",
  avgCpc: "$3.21",
  costPerConversion: "$5.62",
  impressionShareTop: "66.67%",
};

const GOOGLE_CAMPAIGNS: GoogleCampaignRow[] = [
  {
    id: "gc-head-spa-traffic",
    name: "Head Spa Traffic",
    status: "active",
    budget: "—",
    impressions: 17,
    clicks: 1,
    ctr: "5.88%",
    avgCpc: "$2.28",
    conversions: 1.5,
    costPerConversion: "$1.52",
    impressionShare: "50.00%",
  },
  {
    id: "gc-mothers-day-traffic",
    name: "Mothers Day Traffic",
    status: "paused",
    budget: "—",
    impressions: 186,
    clicks: 6,
    ctr: "3.23%",
    avgCpc: "$3.36",
    conversions: 2.5,
    costPerConversion: "$8.08",
    impressionShare: "69.70%",
  },
  {
    id: "gc-nano-brows",
    name: "Nano Brwos - Sales-Search",
    status: "paused",
    budget: "—",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    avgCpc: "$0.00",
    conversions: 0,
    costPerConversion: "$0.00",
    impressionShare: "—",
  },
  {
    id: "gc-brc-head-spa-detox",
    name: "BRC - Sales - Head Spa Detox",
    status: "paused",
    budget: "—",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    avgCpc: "$0.00",
    conversions: 0,
    costPerConversion: "$0.00",
    impressionShare: "—",
  },
];

const GOOGLE_ADS: GoogleAdRow[] = [
  {
    id: "ga-head-spa-traffic",
    campaignName: "Head Spa Traffic",
    name: "Head Spa Traffic Ad group Updated Keywords",
    status: "active",
    budget: "—",
    impressions: 17,
    clicks: 1,
    ctr: "5.88%",
    avgCpc: "$2.28",
    conversions: 1.5,
    costPerConversion: "$1.52",
    impressionShare: "50.00%",
  },
  {
    id: "ga-mothers-day-traffic",
    campaignName: "Mothers Day Traffic",
    name: "Traffic Ad group Common Keywords",
    status: "paused",
    budget: "—",
    impressions: 186,
    clicks: 6,
    ctr: "3.23%",
    avgCpc: "$3.36",
    conversions: 2.5,
    costPerConversion: "$8.08",
    impressionShare: "69.70%",
  },
  {
    id: "ga-nano-brows",
    campaignName: "Nano Brwos - Sales-Search",
    name: "Ad group 1",
    status: "paused",
    budget: "—",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    avgCpc: "$0.00",
    conversions: 0,
    costPerConversion: "$0.00",
    impressionShare: "—",
  },
  {
    id: "ga-brc-head-spa",
    campaignName: "BRC - Sales - Head Spa Detox",
    name: "Ad group 1",
    status: "paused",
    budget: "—",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    avgCpc: "$0.00",
    conversions: 0,
    costPerConversion: "$0.00",
    impressionShare: "—",
  },
];

const GOOGLE_AD_UNITS: GoogleAdUnitRow[] = [
  {
    id: "gau-1",
    campaignName: "Head Spa Traffic",
    adName: "Head Spa Traffic Ad group Updated Keywords",
    name: "Need A Reset This Week?",
    status: "active",
    budget: "—",
    impressions: 17,
    clicks: 1,
    ctr: "5.88%",
    avgCpc: "$2.28",
    conversions: 1.5,
    costPerConversion: "$1.52",
    impressionShare: "50.00%",
  },
  {
    id: "gau-2",
    campaignName: "Mothers Day Traffic",
    adName: "Traffic Ad group Common Keywords",
    name: "Need A Reset This Week?",
    status: "paused",
    budget: "—",
    impressions: 186,
    clicks: 6,
    ctr: "3.23%",
    avgCpc: "$3.36",
    conversions: 2.5,
    costPerConversion: "$8.08",
    impressionShare: "69.70%",
  },
  {
    id: "gau-3",
    campaignName: "Nano Brwos - Sales-Search",
    adName: "Ad group 1",
    name: "Save 20% on Nano Brows",
    status: "paused",
    budget: "—",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    avgCpc: "$0.00",
    conversions: 0,
    costPerConversion: "$0.00",
    impressionShare: "—",
  },
  {
    id: "gau-4",
    campaignName: "Mothers Day Traffic",
    adName: "Traffic Ad group Common Keywords",
    name: "20% Off Mother’s Day Offer",
    status: "paused",
    budget: "—",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    avgCpc: "$0.00",
    conversions: 0,
    costPerConversion: "$0.00",
    impressionShare: "—",
  },
  {
    id: "gau-5",
    campaignName: "BRC - Sales - Head Spa Detox",
    adName: "Ad group 1",
    name: "Save $35 on Scalp Detox",
    status: "paused",
    budget: "—",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    avgCpc: "$0.00",
    conversions: 0,
    costPerConversion: "$0.00",
    impressionShare: "—",
  },
  {
    id: "gau-6",
    campaignName: "Mothers Day Traffic",
    adName: "Traffic Ad group Common Keywords",
    name: "20% Off for Mother’s Day",
    status: "paused",
    budget: "—",
    impressions: 2,
    clicks: 0,
    ctr: "0.00%",
    avgCpc: "$0.00",
    conversions: 0,
    costPerConversion: "$0.00",
    impressionShare: "—",
  },
];

function distributeDaily(total: number, days: number): number[] {
  const perDay = total / days;
  const values = Array.from({ length: days }, () => Math.floor(perDay * 100) / 100);
  const sum = values.reduce((a, b) => a + b, 0);
  values[values.length - 1] = Math.round((total - sum + values[values.length - 1]) * 100) / 100;
  return values;
}

export function getGoogleChartData(_dateRange: DateRange = { preset: "30d" }): GoogleChartPoint[] {
  const dailyCost = distributeDaily(ACCOUNT_TOTALS.cost, REPORT_DAYS.length);
  const dailyImpressions = distributeDaily(ACCOUNT_TOTALS.impressions, REPORT_DAYS.length);
  const dailyClicks = distributeDaily(ACCOUNT_TOTALS.clicks, REPORT_DAYS.length);

  return REPORT_DAYS.map((date, i) => ({
    date,
    cost: dailyCost[i],
    impressions: Math.round(dailyImpressions[i]),
    clicks: Math.round(dailyClicks[i]),
  }));
}

export function getGoogleCampaigns(): GoogleCampaignRow[] {
  return GOOGLE_CAMPAIGNS;
}

export function getGoogleAds(): GoogleAdRow[] {
  return GOOGLE_ADS;
}

export function getGoogleAdUnits(): GoogleAdUnitRow[] {
  return GOOGLE_AD_UNITS;
}

export const GOOGLE_REPORT_PERIOD = { start: REPORT_START, end: REPORT_END };
