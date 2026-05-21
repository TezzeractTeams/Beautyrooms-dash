import type { LeadStage } from "@/types/dashboard";

/** HubSpot — leads funnel (MQL / SQL) */
export const mockLeadStages: LeadStage[] = [
  { label: "MQL", value: 124, percentage: 67 },
  { label: "SQL", value: 62, percentage: 33 },
  { label: "Booked", value: 47, percentage: 25 },
];
