import type { KpiColumn } from "@/types/dashboard";

/** Top KPI row — blended metrics (Meta + Google + Hub + Blvd later) */
export const mockSummaryKpis: KpiColumn[] = [
  {
    metrics: [
      { label: "Overall", value: "$12,480" },
      { label: "Cost", value: "$4,210" },
      { label: "Daily", value: "$702" },
    ],
  },
  {
    source: "hubspot",
    metrics: [
      { label: "Leads", value: "186" },
      { label: "C.P.L", value: "$22.63" },
    ],
  },
  {
    source: "meta",
    metrics: [
      { label: "Imp.", value: "284K" },
      { label: "C.P.M", value: "$8.42" },
    ],
  },
  {
    source: "google",
    metrics: [
      { label: "Web Cl.", value: "1,240" },
      { label: "Org. Rate", value: "3.8%" },
    ],
  },
  {
    source: "boulevard",
    metrics: [
      { label: "Conv.", value: "47" },
      { label: "Av. C.P.C", value: "$1.94" },
    ],
  },
];
