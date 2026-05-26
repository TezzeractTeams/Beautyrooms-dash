"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { isProviderConnected } from "@/lib/auth/provider-tokens";
import { dateRangeToSinceUntil } from "@/lib/meta/date-range";
import { useSnapshot } from "@/hooks/useSnapshot";
import type { DateRange } from "@/types/dashboard";

export interface MetaOverviewTotals {
  spend: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cpc: number;
  ctr: number;
}

export function useMetaOverview(dateRange: DateRange) {
  const { snapshot, loading: snapshotLoading } = useSnapshot();
  const { data: session, status } = useSession();
  const sessionLoading = status === "loading";
  const isConnected =
    status === "authenticated" &&
    isProviderConnected(session?.meta) &&
    !!session?.meta?.adAccountId;

  const cachedTotals = snapshot?.meta?.overview ?? null;

  const [liveTotals, setLiveTotals] = useState<MetaOverviewTotals | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (snapshotLoading) return;
    if (cachedTotals) return;
    if (!isConnected) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);

      const { since, until } = dateRangeToSinceUntil(dateRange);
      const url = `/api/meta/ads/overview?${new URLSearchParams({ since, until })}`;

      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const json = (await res.json()) as {
          metrics?: MetaOverviewTotals;
          error?: string;
        };

        if (!res.ok || json.error || !json.metrics) return;

        setLiveTotals(json.metrics);
      } catch {
        // Silently fall back to mock data on error
      } finally {
        setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [snapshotLoading, cachedTotals, isConnected, dateRange.preset, dateRange.start, dateRange.end]);

  const totals = cachedTotals ?? liveTotals;

  return {
    totals,
    loading: snapshotLoading || loading,
    isConnected: !!totals || isConnected,
    sessionLoading,
  };
}
