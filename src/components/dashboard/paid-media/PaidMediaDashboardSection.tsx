"use client";

import { useMemo } from "react";
import { useDashboardFilters } from "@/contexts/dashboard-filters";
import {
  getGoogleAdUnits,
  getGoogleAds,
  getGoogleCampaigns,
  getGoogleChartData,
} from "@/lib/mock-data/google-ads";
import { FilterableSection } from "../shared/FilterableSection";
import { GoogleSection } from "../google/GoogleSection";
import { MetaSection } from "../meta/MetaSection";
import { SectionHeader } from "../shared/SectionHeader";
import { SectionSkeleton } from "../shared/SectionSkeleton";
import { useMetaAdsData } from "../meta/useMetaAdsData";

function MetaNotConnected() {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 border border-[rgba(103,92,83,0.08)] bg-surface p-8 text-center">
      <p className="font-sans text-sm font-light text-[#2D2926]/65">
        Connect Meta in the header to load live campaign data.
      </p>
    </div>
  );
}

function MetaError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[140px] flex-col items-center justify-center border border-status-negative/20 bg-status-negative/5 p-6 text-center">
      <p className="font-sans text-sm text-status-negative">{message}</p>
    </div>
  );
}

export function PaidMediaDashboardSection() {
  const { dateRange, showMeta, showGoogle, platform } = useDashboardFilters();

  // ── Live Meta data ────────────────────────────────────────────────────────
  const {
    data: metaLive,
    loading: metaLoading,
    error: metaError,
    isConnected: metaConnected,
    sessionLoading: metaSessionLoading,
  } = useMetaAdsData(dateRange);

  const metaChart = metaLive?.chart ?? [];
  const metaCampaigns = metaLive?.campaigns ?? [];
  const metaAdSets = metaLive?.adSets ?? [];
  const metaAds = metaLive?.ads ?? [];

  // ── Mock Google data (unchanged) ─────────────────────────────────────────
  const googleChart = useMemo(() => getGoogleChartData(dateRange), [dateRange]);
  const googleCampaigns = useMemo(() => getGoogleCampaigns(), []);
  const googleAds = useMemo(() => getGoogleAds(), []);
  const googleAdUnits = useMemo(() => getGoogleAdUnits(), []);

  const showPaidMedia =
    platform === "all" || platform === "meta" || platform === "google";

  if (!showPaidMedia) {
    return (
      <section>
        <SectionHeader
          title="Paid media"
          subtitle="Google Ads & Meta campaigns"
        />
        <div className="border border-[rgba(103,92,83,0.08)] bg-surface p-8 text-center">
          <p className="font-sans text-base font-light text-[#2D2926]/65">
            Boulevard paid media metrics will appear here when the integration is connected.
          </p>
        </div>
      </section>
    );
  }

  function renderMetaContent(opts: { showChart: boolean; showTables: boolean }) {
    // Don't flash "not connected" while session is still resolving
    if (metaSessionLoading || metaLoading) {
      return (
        <SectionSkeleton variant={opts.showChart && !opts.showTables ? "chart" : "table"} />
      );
    }
    if (!metaConnected) return <MetaNotConnected />;
    if (metaError) return <MetaError message={metaError} />;
    return (
      <MetaSection
        chartData={metaChart}
        campaigns={metaCampaigns}
        adSets={metaAdSets}
        ads={metaAds}
        showChart={opts.showChart}
        showTables={opts.showTables}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
      {/* Charts row */}
      <section>
        <SectionHeader
          title="Paid media"
          subtitle="Google Ads & Meta campaigns"
        />
        <div
          className={
            showMeta && showGoogle
              ? "grid grid-cols-1 gap-8 lg:grid-cols-2"
              : "grid grid-cols-1 gap-8"
          }
        >
          {showMeta ? (
            <div>
              <SectionHeader title="Meta" subtitle="Cost & CPM" className="mb-4" />
              <FilterableSection skeletonVariant="chart">
                {renderMetaContent({ showChart: true, showTables: false })}
              </FilterableSection>
            </div>
          ) : null}
          {showGoogle ? (
            <div>
              <SectionHeader
                title="Google"
                subtitle="Cost, impressions & clicks"
                className="mb-4"
              />
              <FilterableSection skeletonVariant="chart">
                <GoogleSection
                  chartData={googleChart}
                  campaigns={googleCampaigns}
                  ads={googleAds}
                  adUnits={googleAdUnits}
                  showChart
                  showTables={false}
                />
              </FilterableSection>
            </div>
          ) : null}
        </div>
      </section>

      {/* Tables */}
      {showMeta ? (
        <section>
          <SectionHeader
            title="Meta campaigns"
            subtitle="Campaign / Ad sets / Ads"
          />
          <FilterableSection skeletonVariant="table">
            {renderMetaContent({ showChart: false, showTables: true })}
          </FilterableSection>
        </section>
      ) : null}

      {showGoogle ? (
        <section>
          <SectionHeader
            title="Google campaigns"
            subtitle="Campaign / Ads / Ad units"
          />
          <FilterableSection skeletonVariant="table">
            <GoogleSection
              chartData={googleChart}
              campaigns={googleCampaigns}
              ads={googleAds}
              adUnits={googleAdUnits}
              showChart={false}
              showTables
            />
          </FilterableSection>
        </section>
      ) : null}
    </div>
  );
}
