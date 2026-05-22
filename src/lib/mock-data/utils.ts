import type { DateRange, Platform } from "@/types/dashboard";

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function defaultCustomDateRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return { start: toISODate(start), end: toISODate(end) };
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(`${start}T12:00:00`);
  const e = new Date(`${end}T12:00:00`);
  const diff = e.getTime() - s.getTime();
  return Math.max(1, Math.floor(diff / 86_400_000) + 1);
}

export function datesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  if (cur > endDate) return [start];

  while (cur <= endDate) {
    dates.push(toISODate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function getChartDates(dateRange: DateRange): string[] {
  if (dateRange.preset === "custom" && dateRange.start && dateRange.end) {
    const all = datesInRange(dateRange.start, dateRange.end);
    return all.length > 90 ? all.slice(-90) : all;
  }

  const days =
    dateRange.preset === "today"
      ? 1
      : dateRange.preset === "7d"
        ? 7
        : dateRange.preset === "90d"
          ? 90
          : 30;

  return lastNDays(days);
}

/** Scale mock metrics by date range */
export function dateRangeMultiplier(dateRange: DateRange): number {
  if (dateRange.preset === "custom" && dateRange.start && dateRange.end) {
    const days = daysBetween(dateRange.start, dateRange.end);
    return Math.min(Math.max(days / 30, 0.04), 3);
  }

  switch (dateRange.preset) {
    case "today":
      return 0.04;
    case "7d":
      return 0.25;
    case "30d":
      return 1;
    case "90d":
      return 2.8;
    default:
      return 1;
  }
}

export function platformMultiplier(platform: Platform): number {
  switch (platform) {
    case "meta":
      return 0.55;
    case "google":
      return 0.45;
    case "boulevard":
      return 0;
    case "all":
    default:
      return 1;
  }
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatCurrencyDecimal(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

export function lastNDays(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function trendFromPercent(p: number): "up" | "down" | "neutral" {
  if (p > 0.5) return "up";
  if (p < -0.5) return "down";
  return "neutral";
}
