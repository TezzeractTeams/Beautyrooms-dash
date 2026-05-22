import type { DateRange, KpiMetric, Platform } from "@/types/dashboard";
import {
  formatCurrency,
  formatCurrencyDecimal,
  formatNumber,
  trendFromPercent,
} from "./utils";

/** Totals from Ad report + BeautyRooms Clinic campaigns (May 15–22, 2026) */
const GOOGLE_TOTALS = {
  cost: 22.47,
  impressions: 205,
  clicks: 7,
  conversions: 4,
  avgCpc: 3.21,
};

const META_TOTALS = {
  cost: 28.06,
  impressions: 1944,
  clicks: 44,
  cpm: 14.43,
};

const COMBINED = {
  cost: GOOGLE_TOTALS.cost + META_TOTALS.cost,
  clicks: GOOGLE_TOTALS.clicks + META_TOTALS.clicks,
  impressions: GOOGLE_TOTALS.impressions + META_TOTALS.impressions,
  conversions: GOOGLE_TOTALS.conversions,
};

const REPORT_DAYS = 7;

export const DEFAULT_STAT_SLOT_IDS = [
  "total-cost",
  "daily-cost",
  "impressions",
  "cpm",
  "web-clicks",
  "cpc",
  "conversions",
] as const;

export const STAT_SLOT_COUNT = DEFAULT_STAT_SLOT_IDS.length;

function buildKpi(
  id: string,
  label: string,
  rawValue: number,
  format: KpiMetric["format"],
  source: KpiMetric["source"],
): KpiMetric {
  let value: string;
  switch (format) {
    case "currency":
      value = formatCurrency(rawValue);
      break;
    case "currencyDecimal":
      value = formatCurrencyDecimal(rawValue);
      break;
    case "percent":
      value = `${rawValue.toFixed(1)}%`;
      break;
    case "number":
    default:
      value = formatNumber(Math.round(rawValue));
  }

  return {
    id,
    label,
    value,
    rawValue,
    format,
    trendPercent: 0,
    trendDirection: trendFromPercent(0),
    source,
  };
}

export function getOverallStats(
  platform: Platform = "all",
  _dateRange: DateRange = { preset: "30d" },
): KpiMetric[] {
  const googleCost = GOOGLE_TOTALS.cost;
  const metaCost = META_TOTALS.cost;
  const totalCost =
    platform === "google"
      ? googleCost
      : platform === "meta"
        ? metaCost
        : COMBINED.cost;

  const dailyCost = totalCost / REPORT_DAYS;

  const impressions =
    platform === "google"
      ? GOOGLE_TOTALS.impressions
      : platform === "meta"
        ? META_TOTALS.impressions
        : COMBINED.impressions;

  const clicks =
    platform === "google"
      ? GOOGLE_TOTALS.clicks
      : platform === "meta"
        ? META_TOTALS.clicks
        : COMBINED.clicks;

  const cpc = clicks > 0 ? totalCost / clicks : 0;

  const all: KpiMetric[] = [
    buildKpi("total-cost", "Total Cost", totalCost, "currency", "combined"),
    buildKpi("daily-cost", "Daily Cost", dailyCost, "currency", "combined"),
    buildKpi("impressions", "Impressions", impressions, "number", platform === "google" ? "google" : "meta"),
    buildKpi("cpm", "CPM", META_TOTALS.cpm, "currencyDecimal", "meta"),
    buildKpi("web-clicks", "Clicks", clicks, "number", platform === "meta" ? "meta" : "google"),
    buildKpi("cpc", "CPC", cpc, "currencyDecimal", "combined"),
    buildKpi("conversions", "Conversions", GOOGLE_TOTALS.conversions, "number", "google"),
  ];

  if (platform === "meta") {
    return all.filter((k) => k.id !== "conversions");
  }

  if (platform === "google") {
    return all.filter((k) => k.id !== "cpm");
  }

  if (platform === "boulevard") {
    return [];
  }

  return all;
}
