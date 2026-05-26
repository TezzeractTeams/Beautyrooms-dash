export interface Ga4OverviewMetrics {
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
}

function parseMetricValue(value: string | undefined): number {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function fetchGa4Overview(
  accessToken: string,
  propertyId: string,
  startDate: string,
  endDate: string,
): Promise<Ga4OverviewMetrics> {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
        ],
      }),
    },
  );

  const data = (await response.json()) as {
    error?: { message?: string };
    rows?: Array<{ metricValues?: Array<{ value?: string }> }>;
  };

  if (!response.ok) {
    throw new Error(data.error?.message ?? "Failed to fetch GA4 data");
  }

  const values = data.rows?.[0]?.metricValues ?? [];

  return {
    sessions: parseMetricValue(values[0]?.value),
    activeUsers: parseMetricValue(values[1]?.value),
    screenPageViews: parseMetricValue(values[2]?.value),
    bounceRate: parseMetricValue(values[3]?.value),
    averageSessionDuration: parseMetricValue(values[4]?.value),
  };
}
