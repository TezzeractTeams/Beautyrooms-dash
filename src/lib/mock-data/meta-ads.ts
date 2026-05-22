import type {
  DateRange,
  MetaAdRow,
  MetaAdSetRow,
  MetaCampaignRow,
  MetaChartPoint,
} from "@/types/dashboard";

/** Meta — BeautyRoomsClinic Campaigns (May 15–22, 2026) */
const REPORT_START = "2026-05-15";
const REPORT_END = "2026-05-22";
const REPORT_DAYS = [
  "2026-05-15",
  "2026-05-16",
  "2026-05-17",
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
];

const ACTIVE_CAMPAIGN_SPEND = 28.06;
const ACTIVE_CAMPAIGN_CPM = 14.43;

function mapDelivery(delivery: string): MetaCampaignRow["status"] {
  return delivery === "active" ? "active" : "paused";
}

const META_CAMPAIGNS: MetaCampaignRow[] = [
  {
    id: "mc-brc-traffic",
    name: "BRC Traffic - IG/FB",
    status: mapDelivery("inactive"),
    budget: "Ad set budget",
    spend: "$0.00",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    cpc: "$0.00",
    conversions: 0,
    roas: "—",
  },
  {
    id: "mc-fp-headspa",
    name: "FP - HeadSpa Detox - Sales",
    status: mapDelivery("inactive"),
    budget: "$15/day",
    spend: "$0.00",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    cpc: "$0.00",
    conversions: 0,
    roas: "—",
  },
  {
    id: "mc-fp-nano-brows",
    name: "FP - Nano Brows - 15 Mins Call",
    status: mapDelivery("inactive"),
    budget: "$21/day",
    spend: "$0.00",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    cpc: "$0.00",
    conversions: 0,
    roas: "—",
  },
  {
    id: "mc-md-headspa-copy",
    name: "Mothers Day - HeadSpa Detox - Sales - Copy",
    status: mapDelivery("inactive"),
    budget: "$15/day",
    spend: "$0.00",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    cpc: "$0.00",
    conversions: 0,
    roas: "—",
  },
  {
    id: "mc-md-headspa-copy2",
    name: "Mothers Day - HeadSpa Detox - Sales - Copy 2",
    status: mapDelivery("inactive"),
    budget: "Ad set budget",
    spend: "$0.00",
    impressions: 0,
    clicks: 0,
    ctr: "—",
    cpc: "$0.00",
    conversions: 0,
    roas: "—",
  },
  {
    id: "mc-head-spa-135",
    name: "Head Spa Detox $135",
    status: "active",
    budget: "$30/day",
    spend: "$28.06",
    impressions: 1944,
    clicks: 44,
    ctr: "4.22%",
    cpc: "$0.34",
    conversions: 0,
    roas: "—",
  },
];

function distributeDaily(total: number, days: number): number[] {
  const perDay = total / days;
  const values = Array.from({ length: days }, () => Math.floor(perDay * 100) / 100);
  const sum = values.reduce((a, b) => a + b, 0);
  values[values.length - 1] = Math.round((total - sum + values[values.length - 1]) * 100) / 100;
  return values;
}

export function getMetaChartData(
  _platform: "facebook" | "instagram" | "combined" = "combined",
  _dateRange: DateRange = { preset: "30d" },
): MetaChartPoint[] {
  const dailyCost = distributeDaily(ACTIVE_CAMPAIGN_SPEND, REPORT_DAYS.length);

  return REPORT_DAYS.map((date, i) => ({
    date,
    cost: dailyCost[i],
    cpm: ACTIVE_CAMPAIGN_CPM,
  }));
}

export function getMetaCampaigns(): MetaCampaignRow[] {
  return META_CAMPAIGNS;
}

export function getMetaAdSets(): MetaAdSetRow[] {
  return [];
}

export function getMetaAds(): MetaAdRow[] {
  return [];
}

export const META_REPORT_PERIOD = { start: REPORT_START, end: REPORT_END };

export function getMetaAccountTotals() {
  const active = META_CAMPAIGNS.filter((c) => c.status === "active");
  const spend = active.reduce((sum, c) => sum + parseMoney(c.spend), 0);
  const impressions = active.reduce((sum, c) => sum + c.impressions, 0);
  const clicks = active.reduce((sum, c) => sum + c.clicks, 0);
  return {
    spend,
    impressions,
    clicks,
    cpm: ACTIVE_CAMPAIGN_CPM,
    activeCampaigns: active.length,
    totalCampaigns: META_CAMPAIGNS.length,
  };
}

function parseMoney(s: string): number {
  return Number(s.replace(/[$,]/g, "")) || 0;
}
