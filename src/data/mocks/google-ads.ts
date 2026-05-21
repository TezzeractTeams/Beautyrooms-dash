import type { ChartPoint, TabbedListItem } from "@/types/dashboard";

/** Google Ads — impressions / click cycle */
export const mockGaImpCycleSeries: ChartPoint[] = [
  { label: "W1", value: 42 },
  { label: "W2", value: 58 },
  { label: "W3", value: 51 },
  { label: "W4", value: 67 },
  { label: "W5", value: 63 },
  { label: "W6", value: 72 },
];

export const mockGoogleCampaigns: TabbedListItem[] = [
  { id: "gc1", name: "Brand — Beauty Rooms", spend: "$890", performance: "4.2% CTR" },
  { id: "gc2", name: "Non-brand — Facials", spend: "$720", performance: "3.1% CTR" },
  { id: "gc3", name: "Non-brand — Injectables", spend: "$540", performance: "2.6% CTR" },
];

export const mockGoogleAds: TabbedListItem[] = [
  { id: "ga1", name: "RSA — Core Services", spend: "$410", performance: "3.8% CTR" },
  { id: "ga2", name: "RSA — Promotions", spend: "$280", performance: "2.9% CTR" },
  { id: "ga3", name: "Display — Remarketing", spend: "$190", performance: "1.2% CTR" },
];

export const mockGoogleAdGroups: TabbedListItem[] = [
  { id: "gg1", name: "Facial Treatments", spend: "$520", performance: "3.4% CTR" },
  { id: "gg2", name: "Laser & Skin", spend: "$430", performance: "2.8% CTR" },
  { id: "gg3", name: "Consultation", spend: "$310", performance: "4.1% CTR" },
];
