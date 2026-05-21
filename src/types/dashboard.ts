/** Data providers — swap mock implementations for API clients later */
export type DataSource = "hubspot" | "meta" | "google" | "boulevard";

export interface KpiMetric {
  label: string;
  value: string;
}

export interface KpiColumn {
  metrics: KpiMetric[];
  source?: DataSource;
}

export interface LeadStage {
  label: string;
  value: number;
  percentage: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface TabbedListItem {
  id: string;
  name: string;
  spend: string;
  performance: string;
}

export type TabKey = "campaigns" | "ads" | "adGroups";

export interface TabbedListData {
  campaigns: TabbedListItem[];
  ads: TabbedListItem[];
  adGroups: TabbedListItem[];
}

export interface DashboardData {
  summary: KpiColumn[];
  leadsKpi: {
    title: string;
    stages: LeadStage[];
    source: DataSource;
  };
  netCostCpm: {
    title: string;
    points: ChartPoint[];
    source: DataSource;
  };
  conversions: {
    title: string;
    metrics: KpiMetric[];
    source: DataSource;
  };
  gaImpCycle: {
    title: string;
    subtitle: string;
    points: ChartPoint[];
    source: DataSource;
  };
  leftTabs: TabbedListData;
  rightTabs: TabbedListData;
}
