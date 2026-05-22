import type { LeadsFunnelData } from "@/types/dashboard";

export function getLeadsFunnelData(): LeadsFunnelData {
  const mql = 186;
  const sql = 92;
  const booked = 47;

  return {
    source: "hubspot",
    stages: [
      {
        id: "mql",
        label: "MQL",
        count: mql,
        percentOfTop: 100,
        dropOffFromPrevious: null,
      },
      {
        id: "sql",
        label: "SQL",
        count: sql,
        percentOfTop: Math.round((sql / mql) * 100),
        dropOffFromPrevious: Math.round((1 - sql / mql) * 100),
      },
      {
        id: "booked",
        label: "Booked",
        count: booked,
        percentOfTop: Math.round((booked / mql) * 100),
        dropOffFromPrevious: Math.round((1 - booked / sql) * 100),
      },
    ],
  };
}
