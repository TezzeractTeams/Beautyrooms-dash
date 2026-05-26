"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { isProviderConnected } from "@/lib/auth/provider-tokens";
import { dateRangeToSinceUntil } from "@/lib/meta/date-range";
import { useSnapshot } from "@/hooks/useSnapshot";
import type { DateRange, MetaAdRow, MetaAdSetRow, MetaCampaignRow, MetaChartPoint } from "@/types/dashboard";

export interface MetaAdsLiveData {
  chart: MetaChartPoint[];
  campaigns: MetaCampaignRow[];
  adSets: MetaAdSetRow[];
  ads: MetaAdRow[];
}

interface UseMetaAdsDataResult {
  data: MetaAdsLiveData | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  sessionLoading: boolean;
}

export function useMetaAdsData(dateRange: DateRange): UseMetaAdsDataResult {
  const { snapshot, loading: snapshotLoading } = useSnapshot();
  const { data: session, status } = useSession();
  const sessionLoading = status === "loading";
  const isLiveConnected =
    status === "authenticated" &&
    isProviderConnected(session?.meta) &&
    !!session?.meta?.adAccountId;

  const cachedMeta = snapshot?.meta ?? null;

  const [liveData, setLiveData] = useState<MetaAdsLiveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (snapshotLoading) return;
    if (cachedMeta) return;
    if (!isLiveConnected) {
      setLiveData(null);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);
      setError(null);

      const { since, until } = dateRangeToSinceUntil(dateRange);
      const url = `/api/meta/ads/data?${new URLSearchParams({ since, until })}`;

      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const json = (await res.json()) as Record<string, unknown> & { error?: string };

        if (!res.ok || json.error) {
          throw new Error(json.error ?? "Failed to load Meta ads");
        }

        setLiveData({
          chart: (json.chart as MetaChartPoint[]) ?? [],
          campaigns: (json.campaigns as MetaCampaignRow[]) ?? [],
          adSets: (json.adSets as MetaAdSetRow[]) ?? [],
          ads: (json.ads as MetaAdRow[]) ?? [],
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load Meta ads");
      } finally {
        setLoading(false);
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [snapshotLoading, cachedMeta, isLiveConnected, dateRange.preset, dateRange.start, dateRange.end]);

  const data: MetaAdsLiveData | null = cachedMeta
    ? {
        chart: cachedMeta.chart,
        campaigns: cachedMeta.campaigns,
        adSets: cachedMeta.adSets,
        ads: cachedMeta.ads,
      }
    : liveData;

  return {
    data,
    loading: snapshotLoading || loading,
    error,
    isConnected: !!data || isLiveConnected,
    sessionLoading,
  };
}
