import type {
  CampaignStatus,
  GoogleAdRow,
  GoogleAdUnitRow,
  GoogleCampaignRow,
} from "@/types/dashboard";
import type { SortableColumn } from "../shared/SortableTable";
import { StatusBadge } from "../shared/StatusBadge";

function parseMoney(s: string): number {
  return Number(s.replace(/[$,/daywk]/g, "")) || 0;
}

function parsePercent(s: string): number {
  return Number(s.replace("%", "")) || 0;
}

const shared = {
  status: <T extends { status: CampaignStatus }>(): SortableColumn<T> => ({
    id: "status",
    label: "Status",
    sortable: true,
    sortValue: (r) => r.status,
    cell: (r) => <StatusBadge status={r.status} />,
  }),
  budget: <T extends { budget: string }>(): SortableColumn<T> => ({
    id: "budget",
    label: "Budget",
    sortable: true,
    sortValue: (r) => parseMoney(r.budget),
    cell: (r) => r.budget,
  }),
  impressions: <T extends { impressions: number }>(): SortableColumn<T> => ({
    id: "impressions",
    label: "Impressions",
    sortable: true,
    sortValue: (r) => r.impressions,
    cell: (r) => r.impressions.toLocaleString(),
  }),
  clicks: <T extends { clicks: number }>(): SortableColumn<T> => ({
    id: "clicks",
    label: "Clicks",
    sortable: true,
    sortValue: (r) => r.clicks,
    cell: (r) => r.clicks.toLocaleString(),
  }),
  ctr: <T extends { ctr: string }>(): SortableColumn<T> => ({
    id: "ctr",
    label: "CTR",
    sortable: true,
    sortValue: (r) => parsePercent(r.ctr),
    cell: (r) => r.ctr,
  }),
  avgCpc: <T extends { avgCpc: string }>(): SortableColumn<T> => ({
    id: "avgCpc",
    label: "Avg. CPC",
    sortable: true,
    sortValue: (r) => parseMoney(r.avgCpc),
    cell: (r) => r.avgCpc,
  }),
  conversions: <T extends { conversions: number }>(): SortableColumn<T> => ({
    id: "conversions",
    label: "Conv.",
    sortable: true,
    sortValue: (r) => r.conversions,
    cell: (r) => r.conversions,
  }),
  costPerConversion: <T extends { costPerConversion: string }>(): SortableColumn<T> => ({
    id: "costPerConversion",
    label: "Cost / Conv.",
    sortable: true,
    sortValue: (r) => parseMoney(r.costPerConversion),
    cell: (r) => r.costPerConversion,
  }),
  impressionShare: <T extends { impressionShare: string }>(): SortableColumn<T> => ({
    id: "impressionShare",
    label: "Imp. share",
    sortable: true,
    sortValue: (r) => parsePercent(r.impressionShare),
    cell: (r) => r.impressionShare,
  }),
};

export const googleCampaignColumns: SortableColumn<GoogleCampaignRow>[] = [
  {
    id: "name",
    label: "Name",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => <span className="font-normal text-heading">{r.name}</span>,
  },
  shared.status<GoogleCampaignRow>(),
  shared.budget<GoogleCampaignRow>(),
  shared.impressions<GoogleCampaignRow>(),
  shared.clicks<GoogleCampaignRow>(),
  shared.ctr<GoogleCampaignRow>(),
  shared.avgCpc<GoogleCampaignRow>(),
  shared.conversions<GoogleCampaignRow>(),
  shared.costPerConversion<GoogleCampaignRow>(),
  shared.impressionShare<GoogleCampaignRow>(),
];

export const googleAdColumns: SortableColumn<GoogleAdRow>[] = [
  {
    id: "campaign",
    label: "Campaign",
    sortable: true,
    sortValue: (r) => r.campaignName,
    cell: (r) => r.campaignName,
    className: "max-w-[140px] truncate",
  },
  {
    id: "name",
    label: "Ad",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => <span className="font-normal text-heading">{r.name}</span>,
  },
  shared.status<GoogleAdRow>(),
  shared.budget<GoogleAdRow>(),
  shared.impressions<GoogleAdRow>(),
  shared.clicks<GoogleAdRow>(),
  shared.ctr<GoogleAdRow>(),
  shared.avgCpc<GoogleAdRow>(),
  shared.conversions<GoogleAdRow>(),
  shared.costPerConversion<GoogleAdRow>(),
  shared.impressionShare<GoogleAdRow>(),
];

export const googleAdUnitColumns: SortableColumn<GoogleAdUnitRow>[] = [
  {
    id: "campaign",
    label: "Campaign",
    sortable: true,
    sortValue: (r) => r.campaignName,
    cell: (r) => r.campaignName,
    className: "max-w-[120px] truncate",
  },
  {
    id: "ad",
    label: "Ad",
    sortable: true,
    sortValue: (r) => r.adName,
    cell: (r) => r.adName,
    className: "max-w-[120px] truncate",
  },
  {
    id: "name",
    label: "Ad unit",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => <span className="font-normal text-heading">{r.name}</span>,
  },
  shared.status<GoogleAdUnitRow>(),
  shared.budget<GoogleAdUnitRow>(),
  shared.impressions<GoogleAdUnitRow>(),
  shared.clicks<GoogleAdUnitRow>(),
  shared.ctr<GoogleAdUnitRow>(),
  shared.avgCpc<GoogleAdUnitRow>(),
  shared.conversions<GoogleAdUnitRow>(),
  shared.costPerConversion<GoogleAdUnitRow>(),
  shared.impressionShare<GoogleAdUnitRow>(),
];
