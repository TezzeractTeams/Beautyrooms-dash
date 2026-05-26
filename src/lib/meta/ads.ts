import type {
  CampaignStatus,
  MetaAdRow,
  MetaAdSetRow,
  MetaCampaignRow,
  MetaChartPoint,
} from "@/types/dashboard";

const GRAPH_API = "https://graph.facebook.com/v21.0";

// ---------------------------------------------------------------------------
// Internal graph helpers
// ---------------------------------------------------------------------------

interface GraphError {
  error?: { message?: string; code?: number };
}

interface InsightsAction {
  action_type: string;
  value: string;
}

interface InsightsRow {
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  actions?: InsightsAction[];
  purchase_roas?: InsightsAction[];
  date_start?: string;
  date_stop?: string;
}

interface GraphList<T> extends GraphError {
  data?: T[];
  paging?: { cursors?: unknown; next?: string };
}

async function graphGet<T>(url: string): Promise<T[]> {
  const results: T[] = [];
  let next: string | null = url;

  while (next) {
    const res = await fetch(next);
    const body = (await res.json()) as GraphList<T>;

    if (!res.ok) {
      const err = (body as GraphError).error;
      throw new Error(err?.message ?? `Graph API error (${res.status})`);
    }

    results.push(...(body.data ?? []));
    next = body.paging?.next ?? null;
  }

  return results;
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function num(v: string | undefined): number {
  if (!v) return 0;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtBudget(dailyCents: string | undefined, lifetimeCents: string | undefined): string {
  if (dailyCents && dailyCents !== "0") {
    return `${fmtCurrency(Number.parseInt(dailyCents, 10) / 100)}/day`;
  }
  if (lifetimeCents && lifetimeCents !== "0") {
    return `${fmtCurrency(Number.parseInt(lifetimeCents, 10) / 100)} total`;
  }
  return "Ad set budget";
}

function fmtPct(v: string | undefined): string {
  const n = num(v);
  return n === 0 ? "—" : `${n.toFixed(2)}%`;
}

function fmtCpc(v: string | undefined): string {
  const n = num(v);
  return n === 0 ? "—" : fmtCurrency(n);
}

function fmtRoas(rows: InsightsAction[] | undefined): string {
  const ROAS_TYPES = ["omni_purchase", "purchase", "website_purchase_roas"];
  const row = rows?.find((r) => ROAS_TYPES.includes(r.action_type));
  if (!row) return "—";
  const n = Number.parseFloat(row.value);
  return Number.isFinite(n) ? `${n.toFixed(2)}x` : "—";
}

function fmtConversions(actions: InsightsAction[] | undefined): number {
  const CONV_TYPES = [
    "purchase",
    "omni_purchase",
    "offsite_conversion.fb_pixel_purchase",
    "offsite_conversion.fb_pixel_complete_registration",
  ];
  const row = actions?.find((a) => CONV_TYPES.includes(a.action_type));
  return row ? Math.round(num(row.value)) : 0;
}

function mapStatus(s: string | undefined): CampaignStatus {
  if (!s) return "paused";
  const u = s.toUpperCase();
  if (u === "ACTIVE") return "active";
  if (u === "PAUSED" || u === "CAMPAIGN_PAUSED" || u === "ADSET_PAUSED") return "paused";
  return "ended";
}

// ---------------------------------------------------------------------------
// Entity types from Graph API
// ---------------------------------------------------------------------------

interface CampaignEntity {
  id: string;
  name: string;
  status: string;
  effective_status?: string;
  daily_budget?: string;
  lifetime_budget?: string;
}

interface AdSetEntity {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  effective_status?: string;
  daily_budget?: string;
  lifetime_budget?: string;
}

interface AdEntity {
  id: string;
  name: string;
  campaign_id: string;
  adset_id: string;
  status: string;
  effective_status?: string;
}

// ---------------------------------------------------------------------------
// Public API shape
// ---------------------------------------------------------------------------

export interface MetaAdsData {
  chart: MetaChartPoint[];
  campaigns: MetaCampaignRow[];
  adSets: MetaAdSetRow[];
  ads: MetaAdRow[];
  accountName?: string;
}

export interface MetaAdsOverview {
  spend: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cpc: number;
  ctr: number;
  reach: number;
  accountName?: string;
}

// ---------------------------------------------------------------------------
// Main fetch
// ---------------------------------------------------------------------------

export async function fetchMetaAdsData(
  accessToken: string,
  adAccountId: string,
  since: string,
  until: string,
): Promise<MetaAdsData> {
  const actId = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
  const timeRange = JSON.stringify({ since, until });
  const tok = `access_token=${encodeURIComponent(accessToken)}`;

  const insightsBase = `${GRAPH_API}/${actId}/insights?time_range=${encodeURIComponent(timeRange)}&limit=200&${tok}`;

  // Fire all 7 requests in parallel
  const [
    campaignEntities,
    adSetEntities,
    adEntities,
    campaignInsights,
    adSetInsights,
    adInsights,
    dailyInsights,
    accountData,
  ] = await Promise.all([
    graphGet<CampaignEntity>(
      `${GRAPH_API}/${actId}/campaigns?fields=id,name,status,effective_status,daily_budget,lifetime_budget&limit=500&${tok}`,
    ),
    graphGet<AdSetEntity>(
      `${GRAPH_API}/${actId}/adsets?fields=id,name,campaign_id,status,effective_status,daily_budget,lifetime_budget&limit=500&${tok}`,
    ),
    graphGet<AdEntity>(
      `${GRAPH_API}/${actId}/ads?fields=id,name,campaign_id,adset_id,status,effective_status&limit=500&${tok}`,
    ),
    graphGet<InsightsRow>(
      `${insightsBase}&level=campaign&fields=campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,actions,purchase_roas`,
    ),
    graphGet<InsightsRow>(
      `${insightsBase}&level=adset&fields=adset_id,adset_name,campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,actions,purchase_roas`,
    ),
    graphGet<InsightsRow>(
      `${insightsBase}&level=ad&fields=ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,actions,purchase_roas`,
    ),
    graphGet<InsightsRow>(
      `${insightsBase}&fields=spend,cpm&time_increment=1`,
    ),
    fetch(
      `${GRAPH_API}/${actId}?fields=name&${tok}`,
    ).then((r) => r.json() as Promise<GraphError & { name?: string }>),
  ]);

  // Build lookup maps
  const campaignInsightMap = new Map(campaignInsights.map((r) => [r.campaign_id, r]));
  const adSetInsightMap = new Map(adSetInsights.map((r) => [r.adset_id, r]));
  const adInsightMap = new Map(adInsights.map((r) => [r.ad_id, r]));

  const campaignNameMap = new Map(campaignEntities.map((c) => [c.id, c.name]));
  const adSetNameMap = new Map(adSetEntities.map((a) => [a.id, a.name]));

  // Shape campaigns
  const campaigns: MetaCampaignRow[] = campaignEntities.map((c) => {
    const ins = campaignInsightMap.get(c.id);
    return {
      id: c.id,
      name: c.name,
      status: mapStatus(c.effective_status ?? c.status),
      budget: fmtBudget(c.daily_budget, c.lifetime_budget),
      spend: fmtCurrency(num(ins?.spend)),
      impressions: Math.round(num(ins?.impressions)),
      clicks: Math.round(num(ins?.clicks)),
      ctr: fmtPct(ins?.ctr),
      cpc: fmtCpc(ins?.cpc),
      conversions: fmtConversions(ins?.actions),
      roas: fmtRoas(ins?.purchase_roas),
    };
  });

  // Shape ad sets
  const adSets: MetaAdSetRow[] = adSetEntities.map((a) => {
    const ins = adSetInsightMap.get(a.id);
    return {
      id: a.id,
      name: a.name,
      campaignName: campaignNameMap.get(a.campaign_id) ?? a.campaign_id,
      status: mapStatus(a.effective_status ?? a.status),
      budget: fmtBudget(a.daily_budget, a.lifetime_budget),
      spend: fmtCurrency(num(ins?.spend)),
      impressions: Math.round(num(ins?.impressions)),
      clicks: Math.round(num(ins?.clicks)),
      ctr: fmtPct(ins?.ctr),
      cpc: fmtCpc(ins?.cpc),
      conversions: fmtConversions(ins?.actions),
      roas: fmtRoas(ins?.purchase_roas),
    };
  });

  // Shape ads
  const ads: MetaAdRow[] = adEntities.map((a) => {
    const ins = adInsightMap.get(a.id);
    return {
      id: a.id,
      name: a.name,
      campaignName: campaignNameMap.get(a.campaign_id) ?? a.campaign_id,
      adSetName: adSetNameMap.get(a.adset_id) ?? a.adset_id,
      status: mapStatus(a.effective_status ?? a.status),
      budget: "—",
      spend: fmtCurrency(num(ins?.spend)),
      impressions: Math.round(num(ins?.impressions)),
      clicks: Math.round(num(ins?.clicks)),
      ctr: fmtPct(ins?.ctr),
      cpc: fmtCpc(ins?.cpc),
      conversions: fmtConversions(ins?.actions),
      roas: fmtRoas(ins?.purchase_roas),
    };
  });

  // Shape chart
  const chart: MetaChartPoint[] = dailyInsights.map((r) => ({
    date: r.date_start ?? "",
    cost: num(r.spend),
    cpm: num(r.cpm),
  }));

  return {
    chart,
    campaigns,
    adSets,
    ads,
    accountName: accountData.name,
  };
}

// ---------------------------------------------------------------------------
// Account-level overview (used by existing /api/meta/ads/overview route)
// ---------------------------------------------------------------------------

export async function fetchMetaAdsOverview(
  accessToken: string,
  adAccountId: string,
  since: string,
  until: string,
): Promise<MetaAdsOverview> {
  const actId = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
  const timeRange = JSON.stringify({ since, until });
  const tok = `access_token=${encodeURIComponent(accessToken)}`;

  const [insightsRes, accountRes] = await Promise.all([
    fetch(
      `${GRAPH_API}/${actId}/insights?fields=spend,impressions,clicks,cpm,cpc,ctr,reach&time_range=${encodeURIComponent(timeRange)}&${tok}`,
    ),
    fetch(`${GRAPH_API}/${actId}?fields=name&${tok}`),
  ]);

  const insightsData = (await insightsRes.json()) as GraphError & {
    data?: Array<Record<string, string>>;
  };
  const accountData = (await accountRes.json()) as GraphError & { name?: string };

  if (!insightsRes.ok) {
    throw new Error(
      insightsData.error?.message ?? "Failed to fetch Meta Ads insights",
    );
  }

  const row = insightsData.data?.[0] ?? {};

  return {
    spend: num(row.spend),
    impressions: num(row.impressions),
    clicks: num(row.clicks),
    cpm: num(row.cpm),
    cpc: num(row.cpc),
    ctr: num(row.ctr),
    reach: num(row.reach),
    accountName: accountData.name,
  };
}
