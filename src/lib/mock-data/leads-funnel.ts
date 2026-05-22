import type { LeadsFunnelData } from "@/types/dashboard";

/** No leads data in current reports */
export function getLeadsFunnelData(): LeadsFunnelData {
  return {
    source: "hubspot",
    stages: [],
  };
}
