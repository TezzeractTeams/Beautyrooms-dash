import type { DateRange, KpiMetric, Platform } from "@/types/dashboard";
import {
  dateRangeMultiplier,
  formatCurrency,
  formatCurrencyDecimal,
  formatNumber,
  platformMultiplier,
  trendFromPercent,
} from "./utils";

interface RawKpi {
  id: string;
  label: string;
  baseValue: number;
  format: "currency" | "currencyDecimal" | "number" | "percent";
  trendPercent: number;
  source: KpiMetric["source"];
  metaOnly?: boolean;
  googleOnly?: boolean;
}

const BASE_KPIS: RawKpi[] = [
  { id: "total-cost", label: "Total Cost", baseValue: 12480, format: "currency", trendPercent: 8.2, source: "combined" },
  { id: "daily-cost", label: "Daily Cost", baseValue: 416, format: "currency", trendPercent: 3.1, source: "combined" },
  { id: "leads", label: "Leads", baseValue: 186, format: "number", trendPercent: 12.4, source: "hubspot" },
  { id: "cpc", label: "CPC", baseValue: 1.94, format: "currencyDecimal", trendPercent: -4.2, source: "combined" },
  { id: "impressions", label: "Impressions", baseValue: 284000, format: "number", trendPercent: 15.6, source: "meta", metaOnly: true },
  { id: "cpm", label: "CPM", baseValue: 8.42, format: "currencyDecimal", trendPercent: 18.0, source: "meta", metaOnly: true },
  { id: "web-clicks", label: "Web Clicks", baseValue: 1240, format: "number", trendPercent: 6.8, source: "google", googleOnly: true },
  { id: "conversions", label: "Conversions", baseValue: 47, format: "number", trendPercent: 9.3, source: "boulevard" },
];

/** Default metric shown in each stat card slot (8 cards) */
export const DEFAULT_STAT_SLOT_IDS = [
  "total-cost",
  "daily-cost",
  "leads",
  "cpc",
  "impressions",
  "cpm",
  "web-clicks",
  "conversions",
] as const;

export const STAT_SLOT_COUNT = DEFAULT_STAT_SLOT_IDS.length;

function formatValue(value: number, format: RawKpi["format"]): string {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "currencyDecimal":
      return formatCurrencyDecimal(value);
    case "percent":
      return `${value.toFixed(1)}%`;
    case "number":
    default:
      return formatNumber(Math.round(value));
  }
}

export function getOverallStats(
  platform: Platform = "all",
  dateRange: DateRange = { preset: "30d" },
): KpiMetric[] {
  const dateMult = dateRangeMultiplier(dateRange);
  const platMult = platformMultiplier(platform);

  return BASE_KPIS.filter((kpi) => {
    if (platform === "meta" && kpi.googleOnly) return false;
    if (platform === "google" && kpi.metaOnly) return false;
    if (platform === "boulevard") {
      return kpi.source === "boulevard" || kpi.id === "leads";
    }
    return true;
  }).map((kpi) => {
    let value = kpi.baseValue * dateMult;
    if (platform !== "all" && kpi.source === "combined") {
      value *= platMult / (kpi.metaOnly ? 0.55 : kpi.googleOnly ? 0.45 : 1);
    } else if (platform === "meta" && kpi.source === "combined") {
      value *= 0.55;
    } else if (platform === "google" && kpi.source === "combined") {
      value *= 0.45;
    }

    const trendScale =
      platform === "meta" ? 0.92 : platform === "google" ? 0.88 : 1;
    const trendPercent =
      platform === "all" ? kpi.trendPercent : kpi.trendPercent * trendScale;

    return {
      id: kpi.id,
      label: kpi.label,
      value: formatValue(value, kpi.format),
      rawValue: value,
      format: kpi.format,
      trendPercent: Math.round(trendPercent * 10) / 10,
      trendDirection: trendFromPercent(trendPercent),
      source: kpi.source,
    };
  });
}
