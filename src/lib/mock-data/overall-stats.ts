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

export interface LiveMetaTotals {
  spend: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cpc: number;
}

export function getOverallStats(
  platform: Platform = "all",
  dateRange: DateRange = { preset: "30d" },
  liveMeta?: LiveMetaTotals | null,
): KpiMetric[] {
  const googleCost = GOOGLE_TOTALS.cost;

  // Use live Meta data when available, fall back to mock
  const meta = liveMeta ?? META_TOTALS;
  const metaCost = liveMeta ? liveMeta.spend : META_TOTALS.cost;
  const metaImpressions = liveMeta ? liveMeta.impressions : META_TOTALS.impressions;
  const metaClicks = liveMeta ? liveMeta.clicks : META_TOTALS.clicks;
  const metaCpm = liveMeta ? liveMeta.cpm : META_TOTALS.cpm;

  const totalCost =
    platform === "google"
      ? googleCost
      : platform === "meta"
        ? metaCost
        : googleCost + metaCost;

  const reportDays = liveMeta
    ? (() => {
        if (dateRange.preset === "today") return 1;
        if (dateRange.preset === "7d") return 7;
        if (dateRange.preset === "90d") return 90;
        if (dateRange.preset === "custom" && dateRange.start && dateRange.end) {
          const diff =
            (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) /
            86_400_000;
          return Math.max(1, Math.round(diff) + 1);
        }
        return 30;
      })()
    : REPORT_DAYS;

  const dailyCost = totalCost / reportDays;

  const impressions =
    platform === "google"
      ? GOOGLE_TOTALS.impressions
      : platform === "meta"
        ? metaImpressions
        : GOOGLE_TOTALS.impressions + metaImpressions;

  const clicks =
    platform === "google"
      ? GOOGLE_TOTALS.clicks
      : platform === "meta"
        ? metaClicks
        : GOOGLE_TOTALS.clicks + metaClicks;

  const cpc = liveMeta && platform === "meta"
    ? (liveMeta.cpc ?? 0)
    : clicks > 0 ? totalCost / clicks : 0;

  // Keep meta reference for type compatibility
  void meta;

  const all: KpiMetric[] = [
    buildKpi("total-cost", "Total Cost", totalCost, "currency", "combined"),
    buildKpi("daily-cost", "Daily Cost", dailyCost, "currency", "combined"),
    buildKpi("impressions", "Impressions", impressions, "number", platform === "google" ? "google" : "meta"),
    buildKpi("cpm", "CPM", metaCpm, "currencyDecimal", "meta"),
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
