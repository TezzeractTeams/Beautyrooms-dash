import type { KpiValueFormat } from "@/types/dashboard";
import {
  formatCurrency,
  formatCurrencyDecimal,
  formatNumber,
} from "@/lib/mock-data/utils";

export function formatKpiValue(value: number, format: KpiValueFormat): string {
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
