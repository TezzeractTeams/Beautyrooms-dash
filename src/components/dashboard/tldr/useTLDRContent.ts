"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { isProviderConnected } from "@/lib/auth/provider-tokens";
import { dateRangeToSinceUntil } from "@/lib/meta/date-range";
import { useSnapshot } from "@/hooks/useSnapshot";
import type {
  BoulevardKpis,
  DateRange,
  MetaCampaignRow,
  Platform,
  TLDRBullet,
  TLDRContent,
  TLDRSentiment,
} from "@/types/dashboard";
import type { MetaOverviewTotals } from "@/components/dashboard/overall-stats/useMetaOverview";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function bullet(
  id: string,
  text: string,
  sentiment: TLDRSentiment = "neutral",
): TLDRBullet {
  return { id, text, sentiment };
}

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtUSD(n: number): string {
  return n < 1000
    ? `$${n.toFixed(2)}`
    : `$${fmt(Math.round(n))}`;
}

function fmtPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

function formatPeriod(since: string, until: string): string {
  const s = new Date(`${since}T12:00:00`);
  const e = new Date(`${until}T12:00:00`);
  const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opt)}–${e.toLocaleDateString("en-US", { ...opt, year: "numeric" })}`;
}

// ---------------------------------------------------------------------------
// Bullet builders
// ---------------------------------------------------------------------------

interface Ga4Metrics {
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
}

function buildMetaBullets(
  totals: MetaOverviewTotals,
  campaigns: MetaCampaignRow[],
  period: string,
): TLDRBullet[] {
  const bullets: TLDRBullet[] = [];

  if (totals.spend > 0) {
    bullets.push(
      bullet(
        "meta-overview",
        `Meta: ${fmtUSD(totals.spend)} spend, ${fmt(totals.impressions)} impressions, ${fmt(totals.clicks)} link clicks (CPM ${fmtUSD(totals.cpm)}) — ${period}.`,
        "positive",
      ),
    );
  } else {
    bullets.push(
      bullet(
        "meta-no-spend",
        `Meta: $0 spend recorded for ${period}.`,
        "neutral",
      ),
    );
  }

  if (totals.cpc > 0) {
    bullets.push(
      bullet(
        "meta-cpc",
        `Avg. CPC ${fmtUSD(totals.cpc)}, CTR ${fmtPct(totals.ctr)}.`,
        totals.ctr >= 1 ? "positive" : "neutral",
      ),
    );
  }

  const top = [...campaigns]
    .filter((c) => parseFloat(c.spend.replace(/[$,]/g, "")) > 0)
    .sort(
      (a, b) =>
        parseFloat(b.spend.replace(/[$,]/g, "")) -
        parseFloat(a.spend.replace(/[$,]/g, "")),
    )[0];

  if (top) {
    bullets.push(
      bullet(
        `meta-top-${top.id}`,
        `Leading Meta campaign: "${top.name}" — ${top.spend} spend, ${fmt(top.impressions)} impressions, ${top.ctr} CTR.`,
        top.status === "active" ? "positive" : "neutral",
      ),
    );
  }

  const active = campaigns.filter((c) => c.status === "active");
  const inactive = campaigns.filter((c) => c.status !== "active");

  if (active.length > 0) {
    bullets.push(
      bullet(
        "meta-active",
        `${active.length} active Meta campaign${active.length === 1 ? "" : "s"}.`,
        "positive",
      ),
    );
  }
  if (inactive.length > 0) {
    const names = inactive
      .slice(0, 3)
      .map((c) => c.name)
      .join(", ");
    const suffix = inactive.length > 3 ? ` and ${inactive.length - 3} more` : "";
    bullets.push(
      bullet(
        "meta-inactive",
        `${inactive.length} Meta campaign${inactive.length === 1 ? "" : "s"} not active (${names}${suffix}).`,
        inactive.length > active.length ? "negative" : "neutral",
      ),
    );
  }

  return bullets;
}

function buildBoulevardBullets(
  kpis: BoulevardKpis,
  period: string,
): TLDRBullet[] {
  const bullets: TLDRBullet[] = [];

  bullets.push(
    bullet(
      "blvd-overview",
      `Boulevard: ${fmt(kpis.totalAppointments)} appointments, ${fmtUSD(kpis.totalRevenue)} revenue — ${period}.`,
      kpis.totalRevenue > 0 ? "positive" : "neutral",
    ),
  );

  if (kpis.totalAppointments > 0) {
    bullets.push(
      bullet(
        "blvd-avg",
        `Avg. ${fmtUSD(kpis.avgRevenue)} per appointment across ${fmt(kpis.totalServices)} services.`,
        "neutral",
      ),
    );
  }

  return bullets;
}

function buildGa4Bullets(metrics: Ga4Metrics): TLDRBullet[] {
  const mins = Math.floor(metrics.averageSessionDuration / 60);
  const secs = Math.round(metrics.averageSessionDuration % 60);
  const duration = `${mins}m ${secs}s`;

  return [
    bullet(
      "ga4-overview",
      `Website: ${fmt(metrics.sessions)} sessions, ${fmt(metrics.activeUsers)} active users, ${fmt(metrics.screenPageViews)} page views.`,
      "neutral",
    ),
    bullet(
      "ga4-engagement",
      `Bounce rate ${metrics.bounceRate.toFixed(1)}%, avg. session ${duration}.`,
      metrics.bounceRate < 50 ? "positive" : metrics.bounceRate > 70 ? "negative" : "neutral",
    ),
  ];
}

// ---------------------------------------------------------------------------
// API shapes
// ---------------------------------------------------------------------------

interface MetaOverviewApiResponse {
  metrics?: MetaOverviewTotals;
  error?: string;
}

interface MetaAdsDataApiResponse {
  campaigns?: MetaCampaignRow[];
  error?: string;
}

interface BoulevardApiResponse {
  kpis?: BoulevardKpis;
  error?: string;
}

interface Ga4ApiResponse {
  metrics?: Ga4Metrics;
  error?: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTLDRContent(
  platform: Platform,
  dateRange: DateRange,
  refreshKey = 0,
): { content: TLDRContent; loading: boolean } {
  const { snapshot, loading: snapshotLoading } = useSnapshot();
  const { data: session, status } = useSession();
  const sessionLoading = status === "loading";

  const isMetaConnected =
    status === "authenticated" &&
    isProviderConnected(session?.meta) &&
    !!session?.meta?.adAccountId;

  const isGoogleConnected =
    status === "authenticated" && !!session?.google?.accessToken;

  const [content, setContent] = useState<TLDRContent>({ summary: [], predictions: [] });
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (sessionLoading || snapshotLoading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const { since, until } = dateRangeToSinceUntil(dateRange);
    const period = formatPeriod(since, until);
    const signal = controller.signal;
    const headers: Record<string, string> = { "ngrok-skip-browser-warning": "true" };

    async function load() {
      setLoading(true);
      const summary: TLDRBullet[] = [];

      // ---- Meta ---- (use snapshot if available, else live)
      if (platform === "all" || platform === "meta") {
        const cachedMeta = snapshot?.meta;
        if (cachedMeta) {
          summary.push(
            ...buildMetaBullets(cachedMeta.overview, cachedMeta.campaigns, period),
          );
        } else if (isMetaConnected) {
          try {
            const qs = new URLSearchParams({ since, until });
            const [ovRes, dataRes] = await Promise.all([
              fetch(`/api/meta/ads/overview?${qs}`, { signal, headers }),
              fetch(`/api/meta/ads/data?${qs}`, { signal, headers }),
            ]);

            const ovJson = (await ovRes.json()) as MetaOverviewApiResponse;
            const dataJson = (await dataRes.json()) as MetaAdsDataApiResponse;

            if (ovJson.metrics) {
              summary.push(
                ...buildMetaBullets(
                  ovJson.metrics,
                  dataJson.campaigns ?? [],
                  period,
                ),
              );
            }
          } catch {
            // aborted or network error — skip silently
          }
        } else if (platform === "meta") {
          summary.push(
            bullet(
              "meta-disconnected",
              "No cached data yet. Go to Settings and click \"Sync Data\".",
              "neutral",
            ),
          );
        }
      }

      // ---- Boulevard ---- (use snapshot if available, else live API)
      if (platform === "all" || platform === "boulevard") {
        const cachedBlvd = snapshot?.boulevard;
        if (cachedBlvd) {
          summary.push(...buildBoulevardBullets(cachedBlvd.kpis, period));
        } else {
          try {
            const qs = new URLSearchParams({ since, until });
            const blvdRes = await fetch(`/api/boulevard/appointments?${qs}`, {
              signal,
            });
            const blvdJson = (await blvdRes.json()) as BoulevardApiResponse;

            if (blvdJson.kpis) {
              summary.push(...buildBoulevardBullets(blvdJson.kpis, period));
            }
          } catch {
            // skip
          }
        }
      }

      // ---- GA4 ---- (use snapshot if available, else live)
      if (platform === "all" || platform === "google") {
        const cachedGa4 = snapshot?.ga4;
        if (cachedGa4) {
          summary.push(...buildGa4Bullets(cachedGa4));
        } else if (isGoogleConnected) {
          try {
            const ga4Res = await fetch("/api/analytics/overview", {
              signal,
              headers,
            });
            const ga4Json = (await ga4Res.json()) as Ga4ApiResponse;

            if (ga4Json.metrics) {
              summary.push(...buildGa4Bullets(ga4Json.metrics));
            }
          } catch {
            // skip
          }
        } else if (platform === "google") {
          summary.push(
            bullet(
              "google-disconnected",
              "No cached data yet. Go to Settings and click \"Sync Data\".",
              "neutral",
            ),
          );
        }
      }

      if (!controller.signal.aborted) {
        setContent({ summary, predictions: [] });
        setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [
    snapshotLoading,
    snapshot,
    sessionLoading,
    isMetaConnected,
    isGoogleConnected,
    platform,
    dateRange.preset,
    dateRange.start,
    dateRange.end,
    refreshKey,
  ]);

  return { content, loading: snapshotLoading || loading };
}
