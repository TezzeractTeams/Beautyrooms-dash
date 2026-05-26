"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RefreshCw } from "lucide-react";
import { GoogleConnectButton } from "@/components/auth/GoogleConnectButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { MetaAdAccountSelect } from "@/components/auth/MetaAdAccountSelect";
import { MetaConnectButton } from "@/components/auth/MetaConnectButton";
import { AnimatedEnter } from "@/components/dashboard/shared/AnimatedEnter";
import { SectionHeader } from "@/components/dashboard/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { isProviderConnected } from "@/lib/auth/provider-tokens";
import { cn } from "@/lib/utils";
import type { SyncResult } from "@/lib/db/snapshot-types";

const SETTINGS_CALLBACK = "/settings";

interface SyncResponse {
  ok?: boolean;
  syncedAt?: string;
  syncResult?: SyncResult;
  error?: string;
}

interface SnapshotResponse {
  snapshot?: { syncedAt?: string; syncResult?: SyncResult } | null;
}

interface BoulevardBusinessResponse {
  business: {
    id: string;
    name: string;
  };
  error?: string;
}

interface ConnectionCardProps {
  title: string;
  description: string;
  status: "connected" | "disconnected" | "coming-soon";
  children?: React.ReactNode;
}

function ConnectionStatusBadge({
  status,
}: {
  status: ConnectionCardProps["status"];
}) {
  if (status === "coming-soon") {
    return (
      <span className="inline-flex items-center border border-border bg-muted px-2 py-0.5 font-sans text-[10px] tracking-[0.1em] uppercase text-warm-brown/70">
        Coming soon
      </span>
    );
  }

  const isConnected = status === "connected";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 font-sans text-[10px] tracking-[0.1em] uppercase",
        isConnected
          ? "border-status-positive/30 bg-status-positive/5 text-status-positive"
          : "border-border bg-background text-warm-brown/70",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isConnected ? "bg-status-positive" : "bg-warm-brown/40",
        )}
        aria-hidden
      />
      {isConnected ? "Connected" : "Not connected"}
    </span>
  );
}

function ConnectionCard({
  title,
  description,
  status,
  children,
}: ConnectionCardProps) {
  const isDisabled = status === "coming-soon";

  return (
    <article
      className={cn(
        "border border-border bg-background p-5 sm:p-6",
        isDisabled && "opacity-60",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-lg font-light tracking-[-0.01em] text-heading">
              {title}
            </h3>
            <ConnectionStatusBadge status={status} />
          </div>
          <p className="mt-2 max-w-xl font-sans text-sm font-light text-[#2D2926]/65">
            {description}
          </p>
        </div>
        {!isDisabled ? (
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">{children}</div>
        ) : null}
      </div>
    </article>
  );
}

function formatSyncTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function SyncStatusBadge({ result, label }: { result: SyncResult[keyof SyncResult]; label: string }) {
  if (result === "ok") {
    return (
      <span className="inline-flex items-center gap-1 font-sans text-xs text-status-positive">
        <span className="size-1.5 rounded-full bg-status-positive" />
        {label}
      </span>
    );
  }
  if (result === "error") {
    return (
      <span className="inline-flex items-center gap-1 font-sans text-xs text-status-negative">
        <span className="size-1.5 rounded-full bg-status-negative" />
        {label} failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-sans text-xs text-warm-brown/50">
      <span className="size-1.5 rounded-full bg-warm-brown/30" />
      {label} skipped
    </span>
  );
}

export function SettingsPageContent() {
  const { data: session, status } = useSession();
  const [boulevardBusiness, setBoulevardBusiness] = useState<
    BoulevardBusinessResponse["business"] | null
  >(null);
  const [boulevardError, setBoulevardError] = useState<string | null>(null);
  const [boulevardLoading, setBoulevardLoading] = useState(true);

  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const googleConnected =
    status === "authenticated" && isProviderConnected(session?.google);
  const metaConnected =
    status === "authenticated" && isProviderConnected(session?.meta);
  const boulevardConnected = !!boulevardBusiness;

  // Load last sync time on mount
  useEffect(() => {
    async function loadLastSync() {
      try {
        const res = await fetch("/api/dashboard/snapshot");
        const json = (await res.json()) as SnapshotResponse;
        if (json.snapshot?.syncedAt) {
          setLastSyncedAt(json.snapshot.syncedAt);
          setLastSyncResult(json.snapshot.syncResult ?? null);
        }
      } catch {
        // Not critical, just don't show last sync time
      }
    }
    void loadLastSync();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadBoulevardStatus() {
      setBoulevardLoading(true);

      try {
        const response = await fetch("/api/boulevard/business");
        const payload = (await response.json()) as BoulevardBusinessResponse;

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to connect to Boulevard");
        }

        if (!cancelled) {
          setBoulevardBusiness(payload.business);
          setBoulevardError(null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setBoulevardBusiness(null);
          setBoulevardError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to connect to Boulevard",
          );
        }
      } finally {
        if (!cancelled) {
          setBoulevardLoading(false);
        }
      }
    }

    void loadBoulevardStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncError(null);

    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const json = (await res.json()) as SyncResponse;

      if (!res.ok) {
        setSyncError(json.error ?? "Sync failed");
      } else {
        setLastSyncedAt(json.syncedAt ?? new Date().toISOString());
        setLastSyncResult(json.syncResult ?? null);
      }
    } catch {
      setSyncError("Network error — could not reach sync endpoint");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 sm:gap-10">
      <AnimatedEnter delay={0}>
        <SectionHeader
          title="Settings"
          subtitle="Connect your marketing platforms to pull live data into the dashboard."
        />
      </AnimatedEnter>

      <AnimatedEnter delay={35}>
        <section className="flex flex-col gap-4 border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="font-sans text-xs tracking-[0.12em] uppercase text-[#888888]">
              Account
            </h3>
            <p className="mt-2 font-sans text-sm font-light text-[#2D2926]/65">
              Signed in to the dashboard
            </p>
          </div>
          <SignOutButton />
        </section>
      </AnimatedEnter>

      <AnimatedEnter delay={45}>
        <section className="border border-border bg-background p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-sans text-xs tracking-[0.12em] uppercase text-[#888888]">
                Sync Data
              </h3>
              <p className="mt-2 font-sans text-sm font-light text-[#2D2926]/65">
                Fetch the latest data from all connected platforms and save a snapshot. Anyone who
                logs in will see this cached data without needing to connect anything.
              </p>
              {lastSyncedAt ? (
                <p className="mt-3 font-sans text-xs text-warm-brown/60">
                  Last synced: {formatSyncTime(lastSyncedAt)}
                </p>
              ) : (
                <p className="mt-3 font-sans text-xs text-warm-brown/50">
                  No sync yet — click &quot;Sync Now&quot; to fetch data.
                </p>
              )}
              {lastSyncResult ? (
                <div className="mt-2 flex flex-wrap gap-3">
                  <SyncStatusBadge result={lastSyncResult.ga4} label="GA4" />
                  <SyncStatusBadge result={lastSyncResult.meta} label="Meta" />
                  <SyncStatusBadge result={lastSyncResult.boulevard} label="Boulevard" />
                </div>
              ) : null}
              {syncError ? (
                <p className="mt-2 font-sans text-xs text-status-negative">{syncError}</p>
              ) : null}
            </div>
            <Button
              variant="default"
              size="sm"
              className="shrink-0 gap-2"
              disabled={syncing}
              onClick={() => void handleSync()}
            >
              <RefreshCw className={cn("size-3.5", syncing && "animate-spin")} strokeWidth={1.5} />
              {syncing ? "Syncing…" : "Sync Now"}
            </Button>
          </div>
        </section>
      </AnimatedEnter>

      <AnimatedEnter delay={60}>
        <section className="flex flex-col gap-4">
          <h3 className="font-sans text-xs tracking-[0.12em] uppercase text-[#888888]">
            Integrations
          </h3>

          <div className="flex flex-col gap-4">
            <ConnectionCard
              title="Google Analytics"
              description="Connect Google to load GA4 traffic and engagement metrics in the dashboard."
              status={googleConnected ? "connected" : "disconnected"}
            >
              <GoogleConnectButton
                callbackUrl={SETTINGS_CALLBACK}
                showLabel
              />
            </ConnectionCard>

            <ConnectionCard
              title="Meta Ads"
              description="Connect Meta to sync live ad spend, impressions, clicks, and campaign performance."
              status={metaConnected ? "connected" : "disconnected"}
            >
              <div className="flex flex-col items-stretch gap-3 sm:items-end">
                <MetaConnectButton
                  callbackUrl={SETTINGS_CALLBACK}
                  showLabel
                />
                {metaConnected ? (
                  <MetaAdAccountSelect className="w-full sm:max-w-[280px]" />
                ) : null}
              </div>
            </ConnectionCard>

            <ConnectionCard
              title="Boulevard"
              description={
                boulevardConnected
                  ? `Connected to ${boulevardBusiness.name}. Appointment and revenue data will sync from Boulevard.`
                  : boulevardLoading
                    ? "Checking Boulevard connection…"
                    : boulevardError ??
                      "Configure BLVD_API_KEY, BLVD_SECRET_KEY, and BLVD_BUSINESS_ID to connect Boulevard."
              }
              status={boulevardConnected ? "connected" : "disconnected"}
            />
          </div>
        </section>
      </AnimatedEnter>

      {googleConnected || metaConnected || boulevardConnected ? (
        <AnimatedEnter delay={80}>
          <section className="border border-border bg-muted/30 p-5 sm:p-6">
            <h3 className="font-sans text-xs tracking-[0.12em] uppercase text-[#888888]">
              Connected accounts
            </h3>
            <dl className="mt-4 grid gap-3 font-sans text-sm sm:grid-cols-2">
              {googleConnected ? (
                <div>
                  <dt className="text-[10px] tracking-[0.1em] uppercase text-[#888888]">
                    Google
                  </dt>
                  <dd className="mt-1 text-warm-brown">
                    {session?.user?.email ?? session?.user?.name ?? "Connected"}
                  </dd>
                </div>
              ) : null}
              {metaConnected ? (
                <div>
                  <dt className="text-[10px] tracking-[0.1em] uppercase text-[#888888]">
                    Meta ad account
                  </dt>
                  <dd className="mt-1 text-warm-brown">
                    {session?.meta?.adAccountName ??
                      session?.meta?.adAccountId ??
                      "Select an ad account above"}
                  </dd>
                </div>
              ) : null}
              {boulevardConnected ? (
                <div>
                  <dt className="text-[10px] tracking-[0.1em] uppercase text-[#888888]">
                    Boulevard
                  </dt>
                  <dd className="mt-1 text-warm-brown">
                    {boulevardBusiness.name}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
        </AnimatedEnter>
      ) : null}
    </div>
  );
}
