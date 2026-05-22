"use client";

import { useMemo } from "react";
import { useDashboardFilters } from "@/contexts/dashboard-filters";
import {
  getMetaAdSets,
  getMetaAds,
  getMetaCampaigns,
  getMetaChartData,
} from "@/lib/mock-data/meta-ads";
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

export function PaidMediaDashboardSection() {
  const { dateRange, showMeta, showGoogle, platform } = useDashboardFilters();

  const metaChart = useMemo(
    () => getMetaChartData("combined", dateRange),
    [dateRange],
  );
  const metaCampaigns = useMemo(() => getMetaCampaigns(), []);
  const metaAdSets = useMemo(() => getMetaAdSets(), []);
  const metaAds = useMemo(() => getMetaAds(), []);

  const googleChart = useMemo(
    () => getGoogleChartData(dateRange),
    [dateRange],
  );
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
          subtitle="Google Ad report & Meta campaigns (May 15–22, 2026)"
        />
        <div className="border border-[rgba(103,92,83,0.08)] bg-surface p-8 text-center">
          <p className="font-sans text-base font-light text-[#2D2926]/65">
            Boulevard paid media metrics will appear here when the integration
            is connected.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
      <section>
        <SectionHeader
          title="Paid media"
          subtitle="Google Ad report & Meta campaigns (May 15–22, 2026)"
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
                <MetaSection
                  chartData={metaChart}
                  campaigns={metaCampaigns}
                  adSets={metaAdSets}
                  ads={metaAds}
                  showChart
                  showTables={false}
                />
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

      {showMeta ? (
        <section>
          <SectionHeader
            title="Meta campaigns"
            subtitle="Campaign / Ad sets / Ads"
          />
          <FilterableSection skeletonVariant="table">
            <MetaSection
              chartData={metaChart}
              campaigns={metaCampaigns}
              adSets={metaAdSets}
              ads={metaAds}
              showChart={false}
              showTables
            />
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
