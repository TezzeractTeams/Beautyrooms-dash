import type {
  BoulevardAppointmentRow,
  BoulevardKpis,
  MetaAdRow,
  MetaAdSetRow,
  MetaCampaignRow,
  MetaChartPoint,
} from "@/types/dashboard";
import type { MetaOverviewTotals } from "@/components/dashboard/overall-stats/useMetaOverview";

export interface Ga4Snapshot {
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
}

export interface MetaSnapshot {
  overview: MetaOverviewTotals;
  chart: MetaChartPoint[];
  campaigns: MetaCampaignRow[];
  adSets: MetaAdSetRow[];
  ads: MetaAdRow[];
}

export interface BoulevardSnapshot {
  appointments: BoulevardAppointmentRow[];
  kpis: BoulevardKpis;
}

export interface SyncResult {
  ga4: "ok" | "skipped" | "error";
  meta: "ok" | "skipped" | "error";
  boulevard: "ok" | "skipped" | "error";
  ga4Error?: string;
  metaError?: string;
  boulevardError?: string;
}

export interface DashboardSnapshot {
  key: "latest";
  syncedAt: string;
  dateRange: { since: string; until: string };
  ga4: Ga4Snapshot | null;
  meta: MetaSnapshot | null;
  boulevard: BoulevardSnapshot | null;
  syncResult: SyncResult;
}
