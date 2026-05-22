import type {
  CampaignStatus,
  MetaAdRow,
  MetaAdSetRow,
  MetaCampaignRow,
} from "@/types/dashboard";
import type { SortableColumn } from "../shared/SortableTable";
import { StatusBadge } from "../shared/StatusBadge";

function parseMoney(s: string): number {
  return Number(s.replace(/[$,/wk]/g, "")) || 0;
}

function parsePercent(s: string): number {
  return Number(s.replace("%", "")) || 0;
}

function parseRoas(s: string): number {
  return Number(s.replace("x", "")) || 0;
}

const sharedMetaColumns = {
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
  spend: <T extends { spend: string }>(): SortableColumn<T> => ({
    id: "spend",
    label: "Spend",
    sortable: true,
    sortValue: (r) => parseMoney(r.spend),
    cell: (r) => r.spend,
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
  cpc: <T extends { cpc: string }>(): SortableColumn<T> => ({
    id: "cpc",
    label: "CPC",
    sortable: true,
    sortValue: (r) => parseMoney(r.cpc),
    cell: (r) => r.cpc,
  }),
  conversions: <T extends { conversions: number }>(): SortableColumn<T> => ({
    id: "conversions",
    label: "Conv.",
    sortable: true,
    sortValue: (r) => r.conversions,
    cell: (r) => r.conversions,
  }),
  roas: <T extends { roas: string }>(): SortableColumn<T> => ({
    id: "roas",
    label: "ROAS",
    sortable: true,
    sortValue: (r) => parseRoas(r.roas),
    cell: (r) => r.roas,
  }),
};

export const metaCampaignColumns: SortableColumn<MetaCampaignRow>[] = [
  {
    id: "name",
    label: "Name",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => <span className="font-normal text-heading">{r.name}</span>,
  },
  sharedMetaColumns.status<MetaCampaignRow>(),
  sharedMetaColumns.budget<MetaCampaignRow>(),
  sharedMetaColumns.spend<MetaCampaignRow>(),
  sharedMetaColumns.impressions<MetaCampaignRow>(),
  sharedMetaColumns.clicks<MetaCampaignRow>(),
  sharedMetaColumns.ctr<MetaCampaignRow>(),
  sharedMetaColumns.cpc<MetaCampaignRow>(),
  sharedMetaColumns.conversions<MetaCampaignRow>(),
  sharedMetaColumns.roas<MetaCampaignRow>(),
];

export const metaAdSetColumns: SortableColumn<MetaAdSetRow>[] = [
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
    label: "Ad set",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => <span className="font-normal text-heading">{r.name}</span>,
  },
  sharedMetaColumns.status<MetaAdSetRow>(),
  sharedMetaColumns.budget<MetaAdSetRow>(),
  sharedMetaColumns.spend<MetaAdSetRow>(),
  sharedMetaColumns.impressions<MetaAdSetRow>(),
  sharedMetaColumns.clicks<MetaAdSetRow>(),
  sharedMetaColumns.ctr<MetaAdSetRow>(),
  sharedMetaColumns.cpc<MetaAdSetRow>(),
  sharedMetaColumns.conversions<MetaAdSetRow>(),
  sharedMetaColumns.roas<MetaAdSetRow>(),
];

export const metaAdColumns: SortableColumn<MetaAdRow>[] = [
  {
    id: "campaign",
    label: "Campaign",
    sortable: true,
    sortValue: (r) => r.campaignName,
    cell: (r) => r.campaignName,
    className: "max-w-[120px] truncate",
  },
  {
    id: "adSet",
    label: "Ad set",
    sortable: true,
    sortValue: (r) => r.adSetName,
    cell: (r) => r.adSetName,
    className: "max-w-[120px] truncate",
  },
  {
    id: "name",
    label: "Ad",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => <span className="font-normal text-heading">{r.name}</span>,
  },
  sharedMetaColumns.status<MetaAdRow>(),
  sharedMetaColumns.budget<MetaAdRow>(),
  sharedMetaColumns.spend<MetaAdRow>(),
  sharedMetaColumns.impressions<MetaAdRow>(),
  sharedMetaColumns.clicks<MetaAdRow>(),
  sharedMetaColumns.ctr<MetaAdRow>(),
  sharedMetaColumns.cpc<MetaAdRow>(),
  sharedMetaColumns.conversions<MetaAdRow>(),
  sharedMetaColumns.roas<MetaAdRow>(),
];
