import type { ChartPoint, TabbedListItem } from "@/types/dashboard";

/** Meta Ads — spend & CPM trend */
export const mockNetCostCpmSeries: ChartPoint[] = [
  { label: "Mon", value: 6.2 },
  { label: "Tue", value: 7.1 },
  { label: "Wed", value: 8.4 },
  { label: "Thu", value: 7.8 },
  { label: "Fri", value: 9.2 },
  { label: "Sat", value: 8.1 },
  { label: "Sun", value: 7.5 },
];

export const mockMetaCampaigns: TabbedListItem[] = [
  { id: "c1", name: "Spring Facial Promo", spend: "$1,240", performance: "2.4% CTR" },
  { id: "c2", name: "Botox Awareness", spend: "$980", performance: "1.8% CTR" },
  { id: "c3", name: "Retargeting — Site Visitors", spend: "$620", performance: "3.1% CTR" },
];

export const mockMetaAds: TabbedListItem[] = [
  { id: "a1", name: "Video — Welcome Offer", spend: "$420", performance: "2.9% CTR" },
  { id: "a2", name: "Carousel — Services", spend: "$310", performance: "2.1% CTR" },
  { id: "a3", name: "Static — Book Now", spend: "$250", performance: "1.6% CTR" },
];

export const mockMetaAdGroups: TabbedListItem[] = [
  { id: "g1", name: "Lookalike — Clients", spend: "$540", performance: "2.7% CTR" },
  { id: "g2", name: "Interest — Skincare", spend: "$380", performance: "2.0% CTR" },
  { id: "g3", name: "Broad — Local 25mi", spend: "$320", performance: "1.4% CTR" },
];
