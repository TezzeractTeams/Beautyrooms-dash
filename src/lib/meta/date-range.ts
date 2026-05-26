import type { DateRange } from "@/types/dashboard";

export function dateRangeToSinceUntil(dateRange: DateRange): {
  since: string;
  until: string;
} {
  const today = new Date();
  const until = today.toISOString().slice(0, 10);

  if (dateRange.preset === "custom" && dateRange.start && dateRange.end) {
    return { since: dateRange.start, until: dateRange.end };
  }

  const daysBack =
    dateRange.preset === "today"
      ? 0
      : dateRange.preset === "7d"
        ? 6
        : dateRange.preset === "90d"
          ? 89
          : 29; // 30d default

  const since = new Date(today);
  since.setDate(since.getDate() - daysBack);
  return { since: since.toISOString().slice(0, 10), until };
}
