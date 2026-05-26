"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSnapshot } from "@/hooks/useSnapshot";
import { SectionHeader } from "@/components/dashboard/shared/SectionHeader";

interface Ga4Metrics {
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
}

interface Ga4OverviewResponse {
  metrics: Ga4Metrics;
  error?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

const GA4_METRICS = [
  { key: "sessions", label: "Sessions", format: (v: number) => v.toLocaleString() },
  { key: "activeUsers", label: "Active Users", format: (v: number) => v.toLocaleString() },
  {
    key: "screenPageViews",
    label: "Page Views",
    format: (v: number) => v.toLocaleString(),
  },
  { key: "bounceRate", label: "Bounce Rate", format: (v: number) => `${v.toFixed(1)}%` },
  {
    key: "averageSessionDuration",
    label: "Avg. Session",
    format: (v: number) => formatDuration(v),
  },
] as const;

export function Ga4OverviewSection() {
  const { snapshot, loading: snapshotLoading } = useSnapshot();
  const { data: session, status } = useSession();
  const [liveData, setLiveData] = useState<Ga4Metrics | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);

  const isConnected = status === "authenticated" && !!session?.google?.accessToken;
  const cachedData = snapshot?.ga4 ?? null;
  const data = cachedData ?? liveData;
  const loading = snapshotLoading || liveLoading;

  // Fetch live data only if no snapshot and Google is connected
  useEffect(() => {
    if (snapshotLoading) return;
    if (cachedData) return;
    if (!isConnected) return;

    let cancelled = false;
    setLiveLoading(true);

    async function loadGa4() {
      try {
        const response = await fetch("/api/analytics/overview");
        const payload = (await response.json()) as Ga4OverviewResponse;

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load GA4 data");
        }

        if (!cancelled) {
          setLiveData(payload.metrics);
          setLiveError(null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setLiveError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load GA4 data",
          );
        }
      } finally {
        if (!cancelled) {
          setLiveLoading(false);
        }
      }
    }

    void loadGa4();

    return () => {
      cancelled = true;
    };
  }, [snapshotLoading, cachedData, isConnected]);

  const showNotice = !loading && !data && !isConnected;

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Website Analytics"
        subtitle={
          cachedData
            ? `Cached GA4 data · synced ${snapshot?.syncedAt ? new Date(snapshot.syncedAt).toLocaleDateString() : ""}`
            : "Live GA4 data for the last 30 days"
        }
      />

      {showNotice ? (
        <div className="border border-[rgba(103,92,83,0.15)] bg-surface px-4 py-3 font-sans text-sm text-[#888888]">
          No cached data yet. Go to Settings and click &quot;Sync Data&quot;, or connect Google to load live GA4 data.
        </div>
      ) : null}

      {loading ? (
        <p className="font-sans text-sm text-[#888888]">Loading GA4 data…</p>
      ) : null}

      {!loading && liveError && !cachedData ? (
        <div className="border border-[rgba(103,92,83,0.15)] bg-surface px-4 py-3 font-sans text-sm text-[#888888]">
          {liveError}
        </div>
      ) : null}

      {!loading && data ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {GA4_METRICS.map(({ key, label, format }) => (
            <article
              key={key}
              className="border border-[rgba(103,92,83,0.12)] bg-background px-4 py-5 sm:px-5"
            >
              <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#888888]">
                {label}
              </p>
              <p className="mt-2 font-display text-3xl font-medium text-heading">
                {format(data[key])}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
